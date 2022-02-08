import { Controller, Inject } from "@tsed/di";
import { Get } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { AuthService } from "@services/AuthService";
import { SessionService } from "@services/SessionService";
import { Context, Req, Res, UseBefore } from "@tsed/common";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { LoggerService } from "@services/LoggerService";

import { Config } from "@config";
import { HTTPCodes } from "@utils";
import { ProviderIdentity } from "@providers/IProvider";

@Controller("/auth/providers")
export class AuthProvidersRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });

  constructor(
    @Inject() private accountsService: AccountsService,
    @Inject() private authService: AuthService,
    @Inject() private loggerService: LoggerService
  ) {}

  @Get("/:providerId")
  @UseBefore(SessionMiddleware)
  public async getProvider(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const providerId = request.params.providerId || "unknown";
    const redirectTo = (request.query.redirectTo as string) || null;

    const provider = this.authService
      .getProviders()
      .find((p) => p.id === providerId);

    if (!provider) {
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: `Requested provider '${providerId}' does not exist`,
        })}`
      );
    }

    const callbackUrl = provider.getCallbackUrl(request.id, [
      "openid",
      "profile",
      "email",
    ]);

    if (callbackUrl) {
      session.setAction({
        type: "connect-provider",
        connectProvider: {
          providerId: providerId,
          requestId: request.id,
          redirectTo: redirectTo,
        },
      });
      await session.saveSession();
    }

    return response.redirect(callbackUrl);
  }

  // need refactor
  @Get("/:providerId/callback")
  @UseBefore(SessionMiddleware)
  public async getProviderCallback(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const providerId = request.params.providerId || "unknown";
    const provider = this.authService.getProviders().find((p) => p.id === providerId);
    const state = request.query.state || null;
    const redirectTo = session.getAction && session.getAction.connectProvider ? session.getAction.connectProvider.redirectTo : null;

    if (!provider) {
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested provider does not exist",
        })}`
      );
    }

    const connectProviderAction = session.getAction;

    if (connectProviderAction) {
      if (connectProviderAction.type !== "connect-provider") {
        return response.status(HTTPCodes.BadRequest).json({
          error: "invalid_request",
          error_description: "Invalid action",
        });
      }
      if (connectProviderAction.connectProvider.requestId !== state) {
        return response.redirect(
          `${Config.FRONTEND.url}/signin?${new URLSearchParams({
            error: "invalid_request",
            error_description: "Requested state is invalid",
          })}`
        );
      }

      if (
        !connectProviderAction ||
        connectProviderAction.connectProvider.providerId !== providerId
      ) {
        session.delAction();
        session.saveSession();
        return response.redirect(
          `${Config.FRONTEND.url}/signin?${new URLSearchParams({
            error: "invalid_request",
            error_description: "Requested provider is invalid",
          })}`
        );
      }
    } else {
      session.delAction();
      session.saveSession();
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested action is invalid",
        })}`
      );
    }

    const originalUrl = request.originalUrl;

    let providerIdentity: ProviderIdentity;

    try {
      providerIdentity = (await provider.handleCallback(connectProviderAction.connectProvider.requestId, ["openid", "profile", "email"], originalUrl)) as ProviderIdentity;
    } catch (err) {
      session.delAction();
      session.saveSession();
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Invalid request",
        })}`
      );
    }

    if (providerIdentity["error"]) {
      response.status(500);
      session.delAction();
      session.saveSession();
      return response.render("error", { error: providerIdentity["error"] });
    }

    const findedAccount = (await this.accountsService.getAccountByProvider(providerId, providerIdentity.id)) || (await this.accountsService.getAccountByPrimaryEmail(providerIdentity.email));

    const loggedAccount = await this.accountsService.getByUUIDWithRelations(session.getUser.logged ? session.getUser.id : null, ["providers"]);

    if (findedAccount && !session.getUser.logged) {
      if (!findedAccount.providers || !findedAccount.providers.find((p) => p.provider === providerId && p.id === providerIdentity.id)) {
        findedAccount.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: providerIdentity.email,
          picture: providerIdentity.picture,
          account: findedAccount,
        });
        const savedAccount = await this.accountsService.saveAccount(
          findedAccount
        );

        delete savedAccount.password;

        const auth_time = Math.floor(Date.now() / 1000);

        if (
          session.session &&
          session.getUser &&
          session.getUser.logged
        ) {
          if (redirectTo) {
            session.delAction();
            session.saveSession();
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        } else {
          console.log("savedAccount", savedAccount);

          session
            .setUser({
              logged: true,
              id: savedAccount.uuid,
              username: savedAccount.username,
              email: savedAccount.getPrimaryEmail(),
              picture: savedAccount.avatar,
              role: savedAccount.role,
            })
            .setIDP({
              session_id: session.getSession.id,
              session_state: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: savedAccount.uuid,
              idp: providerId, // identity provider
              username: savedAccount.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
              used_authn_methods: []
            })
            .saveSession();

          if (redirectTo) {
            session.delAction();
            session.saveSession();
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        }
      } else {
        if (!findedAccount.isPrimaryEmailVerified()) {
          this.logger.error("Account email doesn't verified", null, true);
          session.delAction();
          session.saveSession();
          return response.redirect(
            `${Config.FRONTEND.url}/signin?${new URLSearchParams({
              error: "invalid_login",
              error_description: "ACCOUNT_EMAIL_NOT_VERIFIED",
            })}`
          );
        }

        if (findedAccount.banned) {
          this.logger.error("Account banned", null, true);
          session.delAction();
          session.saveSession();
          return response.redirect(
            `${Config.FRONTEND.url}/signin?${new URLSearchParams({
              error: "invalid_login",
              error_description: "ACCOUNT_BANNED",
            })}`
          );
        }

        if (findedAccount.enabled2fa) {
          this.logger.info("Account have 2fa", null, true);

          session.delAction();
          session.saveSession();
          session
            .setAction({
              type: "multifactor",
              multifactor: {
                type: "2fa",
                accountId: findedAccount.uuid,
              },
            })
            .saveSession();
          if (redirectTo) {
            return response.redirect(
              `${Config.FRONTEND.url}/signin?redirectTo=${redirectTo}`
            );
          } else {
            return response.redirect(`${Config.FRONTEND.url}/signin`);
          }
        }

        if (
          session.session &&
          session.getUser &&
          session.getUser.logged
        ) {
          return response.redirect(`${Config.FRONTEND.url}/account/general`);
        } else {
          // IN THIS MOMENT USER IS LOGGED SUCCESSFUL

          this.logger.success(
            findedAccount.username + " logged successful in system",
            null,
            true
          );

          const auth_time = Math.floor(Date.now() / 1000);

          session
            .setUser({
              logged: true,
              id: findedAccount.uuid,
              username: findedAccount.username,
              email: findedAccount.getPrimaryEmail(),
              picture: findedAccount.avatar,
              role: findedAccount.role,
            })
            .setIDP({
              session_id: session.getSession.id,
              session_state: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: findedAccount.uuid,
              idp: providerId, // identity provider
              username: findedAccount.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
              used_authn_methods: []
            })
            .saveSession();

          session.delAction();
          session.saveSession();

          if (redirectTo) {
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        }
      }
    } else {
      if (
        session.session &&
        session.getUser &&
        session.getUser.logged
      ) {

        this.accountsService.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: providerIdentity.email,
          picture: providerIdentity.picture,
          account: loggedAccount,
        });

        session.delAction();
        session.saveSession();

        return response.redirect(`${Config.FRONTEND.url}/account/general`);
      } else {
        try {
          const account = await this.accountsService.signupByProvider({
            provider: providerId,
            email: providerIdentity.email,
            username: providerIdentity.name.toLowerCase().split(" ").join("."),
            name: providerIdentity.name,
            id: providerIdentity.id,
            picture: providerIdentity.picture,
            email_verified: providerIdentity.email_verified,
          });

          const auth_time = Math.floor(Date.now() / 1000);

          session
            .setUser({
              logged: true,
              id: account.uuid,
              username: account.username,
              email: account.getPrimaryEmail(),
              picture: account.avatar,
              role: account.role,
            })
            .setIDP({
              session_id: session.getSession.id,
              session_state: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: account.uuid,
              idp: providerId, // identity provider
              username: account.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
              used_authn_methods: []
            })
            .saveSession();

          this.logger.success(
            account.username + " logged successful in system",
            null,
            true
          );

          session.delAction();
          session.saveSession();

          if (redirectTo) {
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        } catch (error) {
          session.delAction();
          session.saveSession();
          return response.redirect(
            `${Config.FRONTEND.url}/signin?error=${error}`
          );
        }
      }
    }
  }

  @Get("/:providerId/disconnect")
  @UseBefore(SessionMiddleware)
  public async getProviderDisconnect(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const providerId = request.params.providerId || "unknown";

    const provider = this.authService
      .getProviders()
      .find((p) => p.id === providerId);

    if (!provider) {
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: `Requested provider '${providerId}' does not exist`,
        })}`
      );
    }

    try {
      const account = await this.accountsService.getByUUIDWithRelations(
        session.getUser.id,
        ["providers"]
      );
      const findProvider = account.providers.find(
        (provider) => provider.provider === providerId
      );
      if (account && findProvider) {
        this.accountsService.removeProvider(findProvider);
        return response.redirect(`${Config.FRONTEND.url}/account/general`);
      } else {
        return response.redirect(`${Config.FRONTEND.url}/account/general`);
      }
    } catch (err) {
      console.log("err", err);
    }
  }
}
