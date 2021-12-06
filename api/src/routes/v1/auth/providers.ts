import { Req, Res } from "@tsed/common";
import { SessionService } from "@services/SessionService";
import { AuthService } from "@services/AuthService";
import { HTTPCodes } from "@utils";
import { AccountsService } from "@services/AccountsService";
import { ProviderIdentity } from "@providers/IProvider";
import { Config } from "@config";
import { LoggerService } from "@services/LoggerService";

export const GET_AuthProviderRoute = (
  session: SessionService,
  auth: AuthService
) => {
  return async (req: Req, res: Res) => {
    const providerId = req.params.providerId || "unknown";
    const redirectTo = (req.query.redirectTo as string) || null;

    const provider = auth.getProviders().find((p) => p.id === providerId);

    if (!provider) {
      return res.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: `Requested provider '${providerId}' does not exist`,
        })}`
      );
    }

    const callbackUrl = provider.getCallbackUrl(req.id, [
      "openid",
      "profile",
      "email",
    ]);

    if (callbackUrl) {
      session.setAction({
        type: "connect-provider",
        connectProvider: {
          providerId: providerId,
          requestId: req.id,
          redirectTo: redirectTo,
        },
      });
      await session.saveSession();
    }

    return res.redirect(callbackUrl);
  };
};

export const GET_AuthProviderCallbackRoute = (
  session: SessionService,
  account: AccountsService,
  auth: AuthService,
  logger: LoggerService
) => {
  return async (req: Req, res: Res) => {
    const providerId = req.params.providerId || "unknown";
    const provider = auth.getProviders().find((p) => p.id === providerId);
    const state = req.query.state || null;
    const redirectTo =
      session.getAction && session.getAction.connectProvider
        ? session.getAction.connectProvider.redirectTo
        : null;

    if (!provider) {
      return res.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested provider does not exist",
        })}`
      );
    }

    const connectProviderAction = session.getAction;

    if (connectProviderAction) {
      if (connectProviderAction.type !== "connect-provider") {
        return res.status(HTTPCodes.BadRequest).json({
          error: "invalid_request",
          error_description: "Invalid action",
        });
      }
      if (connectProviderAction.connectProvider.requestId !== state) {
        return res.redirect(
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
        return res.redirect(
          `${Config.FRONTEND.url}/signin?${new URLSearchParams({
            error: "invalid_request",
            error_description: "Requested provider is invalid",
          })}`
        );
      }
    } else {
      session.delAction();
      session.saveSession();
      return res.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested action is invalid",
        })}`
      );
    }

    const originalUrl = req.originalUrl;

    let providerIdentity: ProviderIdentity;

    try {
      providerIdentity = (await provider.handleCallback(
        connectProviderAction.connectProvider.requestId,
        ["openid", "profile", "email"],
        originalUrl
      )) as ProviderIdentity;
    } catch (err) {
      session.delAction();
      session.saveSession();
      return res.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Invalid request",
        })}`
      );
    }

    if (providerIdentity["error"]) {
      res.status(500);
      session.delAction();
      session.saveSession();
      return res.render("error", { error: providerIdentity["error"] });
    }

    const findedAccount =
      (await account.getAccountByPrimaryEmail(providerIdentity.email)) ||
      (await account.getAccountByProvider(providerId, providerIdentity.id));

    console.log("findedAccount", findedAccount);

    if (findedAccount) {
      if (
        !findedAccount.providers ||
        !findedAccount.providers.find(
          (p) => p.provider === providerId && p.id === providerIdentity.id
        )
      ) {
        findedAccount.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: providerIdentity.email,
          picture: providerIdentity.picture,
          account: findedAccount,
        });
        const savedAccount = await account.saveAccount(findedAccount);

        delete savedAccount.password;

        const auth_time = Math.floor(Date.now() / 1000);

        if (session.session && session.getUser && session.getUser.logged) {
          if (redirectTo) {
            session.delAction();
            session.saveSession();
            return res.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return res.redirect(`${Config.FRONTEND.url}/account/general`);
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
            .setIDC({
              session_id: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: savedAccount.uuid,
              idp: providerId, // identity provider
              username: savedAccount.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
            })
            .saveSession();

          if (redirectTo) {
            session.delAction();
            session.saveSession();
            return res.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return res.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        }
      } else {
        if (!findedAccount.isPrimaryEmailVerified()) {
          logger.error("Account email doesn't verified", null, true);
          session.delAction();
          session.saveSession();
          return res.redirect(
            `${Config.FRONTEND.url}/signin?${new URLSearchParams({
              error: "invalid_login",
              error_description: "ACCOUNT_EMAIL_NOT_VERIFIED",
            })}`
          );
        }

        if (findedAccount.banned) {
          logger.error("Account banned", null, true);
          session.delAction();
          session.saveSession();
          return res.redirect(
            `${Config.FRONTEND.url}/signin?${new URLSearchParams({
              error: "invalid_login",
              error_description: "ACCOUNT_BANNED",
            })}`
          );
        }

        if (findedAccount.enabled2fa) {
          logger.info("Account have 2fa", null, true);

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
            return res.redirect(
              `${Config.FRONTEND.url}/signin?redirectTo=${redirectTo}`
            );
          } else {
            return res.redirect(`${Config.FRONTEND.url}/signin`);
          }
        }

        if (session.session && session.getUser && session.getUser.logged) {
          return res.redirect(`${Config.FRONTEND.url}/account/general`);
        } else {
          // IN THIS MOMENT USER IS LOGGED SUCCESSFUL

          logger.success(
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
            .setIDC({
              session_id: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: findedAccount.uuid,
              idp: providerId, // identity provider
              username: findedAccount.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
            })
            .saveSession();

          session.delAction();
          session.saveSession();

          if (redirectTo) {
            return res.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return res.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        }
      }
    } else {
      if (session.session && session.getUser && session.getUser.logged) {
        const loggedAccount = await account.getByUUIDWithRelations(
          session.getUser.id,
          ["providers"]
        );
        account.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: providerIdentity.email,
          picture: providerIdentity.picture,
          account: loggedAccount,
        });

        session.delAction();
        session.saveSession();

        return res.redirect(`${Config.FRONTEND.url}/account/general`);
      } else {
        account
          .signupByProvider({
            provider: providerId,
            email: providerIdentity.email,
            username: providerIdentity.name.toLowerCase().split(" ").join("."),
            name: providerIdentity.name,
            id: providerIdentity.id,
            picture: providerIdentity.picture,
            email_verified: providerIdentity.email_verified,
          })
          .then((account) => {
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
              .setIDC({
                session_id: session.getSession.id,
                session_issued: new Date(),
                session_expires: session.getSession.cookie.expires,
                sub: account.uuid,
                idp: providerId, // identity provider
                username: account.username,
                amr: [providerId],
                auth_time: auth_time,
                reauth_time: auth_time,
              })
              .saveSession();

            logger.success(
              account.username + " logged successful in system",
              null,
              true
            );

            session.delAction();
            session.saveSession();

            if (redirectTo) {
              return res.redirect(`${Config.FRONTEND.url}${redirectTo}`);
            } else {
              return res.redirect(`${Config.FRONTEND.url}/account/general`);
            }
          })
          .catch((error) => {
            session.delAction();
            session.saveSession();
            return res.redirect(`${Config.FRONTEND.url}/signin?error=${error}`);
          });
      }
    }
  };
};

export const GET_AuthProviderDisconnectRoute = (
  session: SessionService,
  accounts: AccountsService,
  auth: AuthService
) => {
  return async (req: Req, res: Res) => {
    const providerId = req.params.providerId || "unknown";

    const provider = auth.getProviders().find((p) => p.id === providerId);

    if (!provider) {
      return res.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: `Requested provider '${providerId}' does not exist`,
        })}`
      );
    }

    try {
      const account = await accounts.getByUUIDWithRelations(
        session.getUser.id,
        ["providers"]
      );
      const findProvider = account.providers.find(
        (provider) => provider.provider === providerId
      );
      if (account && findProvider) {
        accounts.removeProvider(findProvider);
        return res.redirect(`${Config.FRONTEND.url}/account/general`);
      } else {
        return res.redirect(`${Config.FRONTEND.url}/account/general`);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};
