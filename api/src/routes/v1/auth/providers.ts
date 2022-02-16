import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { AuthService } from "@services/AuthService";
import { SessionService } from "@services/SessionService";
import { BodyParams, Context, Req, Res, UseBefore } from "@tsed/common";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { LoggerService } from "@services/LoggerService";

import { Config } from "@config";
import { HTTPCodes, Validate } from "@utils";
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
    private accountsService: AccountsService,
    private authService: AuthService,
    private loggerService: LoggerService,
  ) {}

  // TODO: need refactor to send email and after confirming email link provider account to existed account or create new account
  @Post("/complete-connect")
  @UseBefore(SessionMiddleware)
  public async postProviderCompleteConnect(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @BodyParams("email") email: string,
    @BodyParams("code") code: string,
  ) {

    const action = session.getAction;

    if (!action || action.type !== "complete-connect-provider") {
      session.delAction();
      await session.saveSession();
      return response.status(HTTPCodes.BadRequest).json({
          error: "invalid_request",
          error_description: "Requested action is invalid",
      });
    }

    const providerId = session.getAction.metadata?.provider || "unknown";
    const providerIdentity = session.getAction.metadata;

    if(!this.authService.getProviders().find((p) => p.id === providerId)) {
      return response.status(HTTPCodes.BadRequest).json({
        error: "invalid_request",
        error_description: `Requested provider '${providerId}' does not exist`,
      });
    }

    if(!email || Validate.isEmpty(email) || Validate.isUndefined(email) || Validate.isNull(email) || !Validate.isEmail(email)) {
      return response.status(HTTPCodes.BadRequest).json({
        type: "error",
        error: "Invalid email"
      });
    }

    if(!providerIdentity.email) {
      session.setAction({
        ...session.getAction,
        metadata: {
          ...session.getAction.metadata ,
          email,
          code: '123456'
        }
      });
      await session.saveSession();

      return response.status(HTTPCodes.OK).json({
        type: "verification-code",
        message: "Enter the code we sent to the email address provided"
      });
    }

    if(providerIdentity.email !== email) {
      return response.status(HTTPCodes.BadRequest).json({
        type: "error",
        error: "Email address is not the same as before"
      });
    }

    if(!code || code !== providerIdentity.code) {
      return response.status(HTTPCodes.BadRequest).json({
        type: "error",
        error: "Invalid code"
      });
    }

    const findedAccount =
      (await this.accountsService.getAccountByProvider(providerId, providerIdentity.id)) ||
      (await this.accountsService.getAccountByPrimaryEmail(email));

    const loggedAccount = await this.accountsService.getByUUIDWithRelations(
      session.getUser.logged ? session.getUser.id : null,
      ["providers"]
    );

    if (findedAccount && !session.getUser.logged) {
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
          email: email,
          picture: providerIdentity.picture,
          account: findedAccount,
        });
        const savedAccount = await this.accountsService.saveAccount(
          findedAccount
        );

        delete savedAccount.password;

        const auth_time = Math.floor(Date.now() / 1000);

        if (session.session && session.getUser && session.getUser.logged) {
          session.delAction();
          session.saveSession();

          return response.status(200).json({
            type: "logged-in"
          });

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
              used_authn_methods: [],
            })
            .saveSession();

            session.delAction();
            await session.saveSession();

            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa>>>>>>>>>>>Aaaaaaaaaa');
            

            return response.status(200).json({
              type: "logged-in"
            });

        }
      } else {
        if (!findedAccount.isPrimaryEmailVerified()) {
          this.logger.error("Account email doesn't verified", null, true);
          session.delAction();
          session.saveSession();

          return response.status(HTTPCodes.BadRequest).json({
            type: "error",
            error: "ACCOUNT_EMAIL_NOT_VERIFIED"
          });

        }



        if (session.session && session.getUser && session.getUser.logged) {

          return response.status(200).json({
            type: "logged-in"
          });

        } else {
          // IN THIS MOMENT USER IS LOGGED SUCCESSFUL

          this.logger.success(findedAccount.username + " logged successful in system", null,true);

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
              used_authn_methods: [],
            })
            .saveSession();

          session.delAction();
          session.saveSession();

          return response.status(200).json({
            type: "logged-in"
          });

        }
      }
    } else {
      if (session.session && session.getUser && session.getUser.logged) {
        this.accountsService.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: email,
          picture: providerIdentity.picture,
          account: loggedAccount,
        });

        session.delAction();
        session.saveSession();

        return response.status(200).json({
          type: "logged-in"
        });

      } else {
        try {
          const account = await this.accountsService.signupByProvider({
            provider: providerId,
            email: email,
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
              used_authn_methods: [],
            })
            .saveSession();

          this.logger.success(account.username + " logged successful in system", null, true);

          session.delAction();
          session.saveSession();

          return response.status(200).json({
            type: "logged-in"
          });
        
        } catch (error) {
          session.delAction();
          session.saveSession();
          return response.status(HTTPCodes.BadRequest).json({
            type: "error",
            error: error
          });
        }
      }
    }
  }

  @Get("/:providerId")
  @UseBefore(SessionMiddleware)
  public async getProvider(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const providerId = request.params.providerId || "unknown";
    const redirectTo = (request.query.redirectTo as string) || null;

    const provider = this.authService.getProviders().find((p) => p.id === providerId);

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
    const connectProviderAction = session.getAction;
    const redirectTo = session.getAction && session.getAction.connectProvider ? session.getAction.connectProvider.redirectTo : null;

    if (!provider) {
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested provider does not exist",
        })}`
      );
    }


    if (!connectProviderAction || connectProviderAction.type !== "connect-provider" || connectProviderAction.connectProvider.requestId !== state) {
      session.delAction();
      await session.saveSession();
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested action is invalid",
        })}`
      );
    }

    if (connectProviderAction.connectProvider.providerId !== providerId) {
      session.delAction();
      await session.saveSession();
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: "invalid_request",
          error_description: "Requested provider is invalid",
        })}`
      );
    }

    const originalUrl = request.originalUrl;
    let providerIdentity: ProviderIdentity;



    providerIdentity = (await provider.handleCallback(connectProviderAction.connectProvider.requestId,
      ["openid", "profile", "email"], originalUrl
    )) as ProviderIdentity;
    
    if (providerIdentity["error"]) {
      response.status(500);
      session.delAction();
      await session.saveSession();
      return response.redirect(
        `${Config.FRONTEND.url}/signin?${new URLSearchParams({
          error: providerIdentity["error"],
          error_description: '',
        })}`
      );
    }

    const findedAccountByProvider = await this.accountsService.getAccountByProvider(
      providerId,
      providerIdentity.id
    );
    const findedAccountByEmail = await this.accountsService.getAccountByPrimaryEmail(
      providerIdentity.email
    );

    const findedAccount = findedAccountByProvider || findedAccountByEmail;

    const loggedAccount = await this.accountsService.getByUUIDWithRelations(
      session.getUser.logged ? session.getUser.id : null,
      ["providers"]
    );

    // IF PROVIDER DOESN'T HAS EMAIL
    if(!findedAccount && !session.getUser.logged && !providerIdentity.email) {
        session.setAction({
          type: "complete-connect-provider",
          metadata: {
            provider: providerId,
            id: providerIdentity.id,
            name: providerIdentity.name,
            username: providerIdentity.username,
            picture: providerIdentity.picture
          }
        });
  
        await session.saveSession();
  
        let redirectUrl = `${Config.FRONTEND.url}/complete-signup`;
  
        if(session.getFlow === "oauth") redirectUrl += `?${new URLSearchParams(session.getClientQuery as any)}`; 
  
        return response.redirect(redirectUrl);

    }

    // FINDED ANY ACCOUNT
    if (findedAccount) {

      // FINDED ACCOUNT BY EMAIL
      if (findedAccountByEmail && !findedAccountByProvider) {

        // IF LOGGED USER ATTACH PROVIDER TO ACCOUNT
        if(session.getUser.logged) {
          this.accountsService.addProvider({
            provider: providerId,
            id: providerIdentity.id,
            name: providerIdentity.name,
            email: 'todo@todo',
            picture: providerIdentity.picture,
            account: loggedAccount,
          });
  
          session.delAction();
          await session.saveSession();
  
          return response.redirect(`${Config.FRONTEND.url}/account/general`);
        }

        // IF NOT LOGGED ATTACH PROVIDER TO FINDED ACCOUNT BY EMAIL
        findedAccount.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: providerIdentity.email,
          picture: providerIdentity.picture,
          account: findedAccount,
        });

        const savedAccount = await this.accountsService.saveAccount(findedAccount);

        delete savedAccount.password;


        await session
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
            auth_time: Math.floor(Date.now() / 1000),
            reauth_time: Math.floor(Date.now() / 1000),
            used_authn_methods: [],
          })
          .saveSession();

          if (redirectTo) {
            session.delAction();
            await session.saveSession();
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        
      } 
      
      // FINDED ACCOUNT BY PROVIDER
      if (findedAccountByProvider) {

        // if (!findedAccount.isPrimaryEmailVerified()) {
        //   this.logger.error("Account email doesn't verified", null, true);
        //   session.delAction();
        //   session.saveSession();
        //   return response.redirect(
        //     `${Config.FRONTEND.url}/signin?${new URLSearchParams({
        //       error: "invalid_login",
        //       error_description: "ACCOUNT_EMAIL_NOT_VERIFIED",
        //     })}`
        //   );
        // }


        await session
          .setUser({
            logged: true,
            id: findedAccountByProvider.uuid,
            username: findedAccountByProvider.username,
            email: findedAccountByProvider.getPrimaryEmail(),
            picture: findedAccountByProvider.avatar,
            role: findedAccountByProvider.role,
          })
          .setIDP({
            session_id: session.getSession.id,
            session_state: session.getSession.id,
            session_issued: new Date(),
            session_expires: session.getSession.cookie.expires,
            sub: findedAccountByProvider.uuid,
            idp: providerId, // identity provider
            username: findedAccountByProvider.username,
            amr: [providerId],
            auth_time: Math.floor(Date.now() / 1000),
            reauth_time: Math.floor(Date.now() / 1000),
            used_authn_methods: [],
          })
          .saveSession();

          if (redirectTo) {
            session.delAction();
            await session.saveSession();
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        
      }
    } else {
      
      // IF LOGGED USER ATTACH PROVIDER TO ACCOUNT
      if(session.getUser.logged) {
        this.accountsService.addProvider({
          provider: providerId,
          id: providerIdentity.id,
          name: providerIdentity.name,
          email: 'todo@todo',
          picture: providerIdentity.picture,
          account: loggedAccount,
        });
  
        session.delAction();
        await session.saveSession();
        return response.redirect(`${Config.FRONTEND.url}/account/general`);
      } 
      
      // IF NOT LOGGED TRY SIGNUP ACCOUNT WITH ATTACHED PROVIDER
        try {
          const newAccount = await this.accountsService.signupByProvider({
            provider: providerId,
            email: providerIdentity.email,
            username: providerIdentity.name.toLowerCase().split(" ").join("."),
            name: providerIdentity.name,
            id: providerIdentity.id,
            picture: providerIdentity.picture,
            email_verified: providerIdentity.email_verified,
          });

          const auth_time = Math.floor(Date.now() / 1000);

          await session
            .setUser({
              logged: true,
              id: newAccount.uuid,
              username: newAccount.username,
              email: newAccount.getPrimaryEmail(),
              picture: newAccount.avatar,
              role: newAccount.role,
            })
            .setIDP({
              session_id: session.getSession.id,
              session_state: session.getSession.id,
              session_issued: new Date(),
              session_expires: session.getSession.cookie.expires,
              sub: newAccount.uuid,
              idp: providerId, // identity provider
              username: newAccount.username,
              amr: [providerId],
              auth_time: auth_time,
              reauth_time: auth_time,
              used_authn_methods: [],
          }).delAction().saveSession();

          if (redirectTo) {
            return response.redirect(`${Config.FRONTEND.url}${redirectTo}`);
          } else {
            return response.redirect(`${Config.FRONTEND.url}/account/general`);
          }
        } catch (error) {
          session.delAction();
          await session.saveSession();
          return response.redirect(`${Config.FRONTEND.url}/signin?error=${error}`);
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
