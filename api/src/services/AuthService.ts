import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";

import { AccountRepository } from "@repositories/AccountRepository";
import { LoggerService } from "@services/LoggerService";
import { SessionService } from "@services/SessionService";

import { Validate } from "@utils";
import { Config } from "@config";
import bcrypt from "bcryptjs";
import { initializeProviders } from "@config/providers";
import { IProvider } from "./../providers/IProvider";
import { AccountsService } from "./AccountsService";
import { EmailRepository } from "@repositories/EmailRepository";
import { TokenService } from "./TokenService";
import * as speakeasy from "speakeasy";

@Injectable()
export class AuthService {
  private logger: LoggerService;
  private providers: IProvider<any>[] = [];

  @Inject()
  @UseConnection("default")
  private accountRepository: AccountRepository;

  @Inject()
  @UseConnection("default")
  private emailRepository: EmailRepository;

  constructor(
    private loggerService: LoggerService,
    private accountsService: AccountsService,
    private tokenService: TokenService
  ) {
    this.logger = this.loggerService.child({
      label: { name: "AuthService", type: "service" },
    });
    this.providers = initializeProviders();
  }

  public signin(
    { email, password, captcha },
    session: SessionService
  ): Promise<any> {
    const ctx = this;
    let error = null;
    const errors = {
      email: null,
      password: null,
    };

    return new Promise(async (resolve, reject) => {
      if (
        Validate.isNull(email) ||
        Validate.isEmpty(email) ||
        Validate.isUndefined(email)
      ) {
        ctx.logger.error("Account email missing", null, true);
        if (!errors.email) {
          errors.email = "ACCOUNT_EMAIL_MISSING";
        }
      }

      if (!Validate.isEmail(email)) {
        ctx.logger.error("Invalid email", null, true);
        if (!errors.email) {
          errors.email = "ACCOUNT_EMAIL_INVALID";
        }
      }

      if (
        Validate.isNull(password) ||
        Validate.isEmpty(password) ||
        Validate.isUndefined(password)
      ) {
        ctx.logger.error("Account password missing", null, true);
        if (!errors.password) {
          errors.password = "ACCOUNT_PASSWORD_MISSING";
        }
      }

      const account = await ctx.accountsService.getAccountByPrimaryEmail(email);

      console.log("account", account);

      if (!account) {
        ctx.logger.error("Account doesn't exists", null, true);
        error = "ACCOUNT_NOT_EXIST";
        return resolve({ type: "error", error, errors });
      }

      if (errors.password || errors.email) {
        return resolve({ type: "error", error, errors });
      }

      if (Validate.isNull(account.password)) {
        return resolve({
          type: "error",
          error:
            "Auth failed, sign in with data provider connected to your account.",
          errors,
        });
      }

      if (account && !account.verifyPassword(password)) {
        ctx.logger.error("Invalid account password", null, true);
        if (!errors.password) {
          errors.password = "ACCOUNT_PASSWORD_INVALID";
        }
        return resolve({
          type: "error",
          error: "ACCOUNT_PASSWORD_INVALID",
          errors,
        });
      }

      if (!account.isPrimaryEmailVerified()) {
        ctx.logger.error("Account email doesn't verified", null, true);
        return resolve({ type: "error", error: "ACCOUNT_EMAIL_NOT_VERIFIED" });
      }

      if (account.banned) {
        ctx.logger.error("Account banned", null, true);
        return resolve({ type: "error", error: "ACCOUNT_BANNED" });
      }


      // IN THIS MOMENT USER IS LOGGED SUCCESSFUL

      ctx.logger.success(
        account.username + " logged successful in OAuth",
        null,
        true
      );

      const auth_time = Math.floor(Date.now() / 1000);

      session.setUser({
        logged: true,
        id: account.uuid,
        username: account.username,
        email: account.getPrimaryEmail(),
        picture: account.avatar,
        role: account.role,
      });

      session.setIDP({
        session_id: session.getSession.id,
        session_state: session.getSession.id,
        session_issued: new Date(),
        session_expires: session.getSession.cookie.expires,
        sub: account.uuid,
        idp: "local", // identity provider
        username: account.username,
        amr: ["pwd"],
        auth_time: auth_time,
        reauth_time: auth_time,
        used_authn_methods: []
      });

      // if (session.getAction && session.getAction.type === "connection") {
      //     await account.providers.push({
      //         provider: session.getAction.provider,
      //         uid: session.getAction.id,
      //     });
      //     await account.save();
      //     session.delAction();
      // }

      session.saveSession();

      resolve({
        type: "logged-in",
      });
    });
  }

  public reauth(data: ReAuthData, session: SessionService): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve, reject) => {
      const { email, password, captcha, ip, country, city } = data;

      if (
        Validate.isNull(email) ||
        Validate.isEmpty(email) ||
        Validate.isUndefined(email)
      ) {
        ctx.logger.error(
          "Account email missing in session, try logout and login again",
          null,
          true
        );
        return resolve({ type: "error", error: "ACCOUNT_EMAIL_MISSING" });
      }

      if (!Validate.isEmail(email)) {
        ctx.logger.error("Invalid email", null, true);
        return resolve({ type: "error", error: "ACCOUNT_EMAIL_INVALID" });
      }

      if (Validate.isEmpty(password) || Validate.isUndefined(password)) {
        ctx.logger.error("Account password missing", null, true);
        return resolve({ type: "error", error: "ACCOUNT_PASSWORD_MISSING" });
      }

      const account = await ctx.accountsService.getAccountByPrimaryEmail(email);

      if (!account) {
        ctx.logger.error("Account doesn't exist", null, true);
        return resolve({ type: "error", error: "ACCOUNT_NOT_EXIST" });
      }

      if (!bcrypt.compareSync(password, account.password)) {
        ctx.logger.error("Invalid account password", null, true);
        return resolve({ type: "error", error: "ACCOUNT_PASSWORD_INVALID" });
      }

      if (account.banned) {
        ctx.logger.error("Account banned", null, true);
        return resolve({ type: "error", error: "ACCOUNT_BANNED" });
      }

      ctx.logger.success(
        account.username + " relogged successful in OAuth",
        null,
        true
      );

      const auth_time = Math.floor(Date.now() / 1000);

      session.setUser({
        logged: true,
        id: account.uuid,
        username: account.username,
        email: account.getPrimaryEmail(),
        picture: Config.CDN.url + "/avatars/" + account.uuid,
        role: account.role,
      });

      session.setIDP({
        ...session.getIDP,
        reauth_time: auth_time,
      });

      session.saveSession();

      resolve({
        type: "logged-in"
      })

    });
  }

  public getProviders() {
    return this.providers;
  }

  public async checkMfaAuthnRequired(accountId: string, session: SessionService, acr_values: string = 'urn:rutsukun:bronze') {
    const account = await this.accountsService.getByUUIDWithRelations(accountId, ["authn_methods"]);
    const enabledMethod =  account.authn_methods.find(m => !!m.enabled);

    if(account.authn_methods.length && enabledMethod) {

      if(acr_values === 'urn:rutsukun:bronze') return null;
      if(session.getIDP.used_authn_methods.find(m => m.method === enabledMethod.type)) return null;

      return {
        type: "multifactor",
        multifactor: {
          type: enabledMethod.type,
          token: await this.tokenService.createMfaToken(account.uuid, enabledMethod.type)
        }
      }

    } else {
      return null;
    }
  }

    public async multifactor(code: string, token: string, session: SessionService): Promise<any> {

        const { valid, data } = this.tokenService.verifyMfaToken(token);

        if (valid && data.multifactor.type === "OTP") {
          const accountId = data.multifactor.accountId;

          const account = await this.accountsService.getByUUIDWithRelations(accountId, ["authn_methods"]);
          const method = account.authn_methods.find(m => m.type === "OTP");

          if(accountId !== account.uuid) {
            return { type: "error", error: "TOKEN_ACCOUNT_INVALID" };
          }

          const verified = speakeasy.totp.verify({
            secret: method.data.secret,
            encoding: "base32",
            token: code,
          });
          
          if (verified) {

            session.setIDP({
              ...session.getIDP,
              used_authn_methods: [
                ...session.getIDP.used_authn_methods,
                {
                  method: 'OTP',
                  first_used_date: new Date(),
                  last_used_date: new Date()
                }
              ]
            });

            await session.saveSession()


            return { type: "logged-in" };

          } else {

            return { type: "error", error: "INVALID_CODE" };
          }
        } else {
          return { type: "error", error: "INVALID_MULTIFACTOR_TYPE" };
        }

    }

  //   public checkEmailExist(email: string) {
  //     const ctx = this;
  //     return new Promise<void>(async (resolve, reject) => {
  //       if (Validate.isEmpty(email) || Validate.isUndefined(email)) {
  //         ctx.logger.error("Account email missing", null, true);
  //         return reject("ACCOUNT_EMAIL_MISSING");
  //       }

  //       if (!Validate.isEmail(email)) {
  //         ctx.logger.error("Invalid email", null, true);
  //         return reject("ACCOUNT_EMAIL_INVALID");
  //       }

  //       const account = await ctx.account.getAccountByEmail(email);

  //       if (!account) {
  //         ctx.logger.success("Email " + email + " is free", null, true);
  //         return resolve();
  //       } else {
  //         ctx.logger.error("Email " + email + " is taken", null, true);
  //         return reject("ACCOUNT_EMAIL_CANNOT_BE_USED");
  //       }
  //     });
  //   }

  //   public checkUsernameExist(username: string) {
  //     const ctx = this;
  //     return new Promise<void>(async (resolve, reject) => {
  //       if (Validate.isEmpty(username) || Validate.isUndefined(username)) {
  //         ctx.logger.error("Account username missing", null, true);
  //         return reject("ACCOUNT_USERNAME_MISSING");
  //       }

  //       const account = await ctx.account.getAccountByUsername(username);

  //       if (!account) {
  //         ctx.logger.success("Username " + username + " is free", null, true);
  //         return resolve();
  //       } else {
  //         ctx.logger.error("Username " + username + " is taken", null, true);
  //         return reject("ACCOUNT_USERNAME_CANNOT_BE_USED");
  //       }
  //     });
  //   }

  //   async impersonate(email: string, req: Request) {
  //     const ctx = this;
  //     return new Promise<void>(async (resolve, reject) => {
  //       const account = await ctx.account.getAccountByEmail(email);
  //       if (!req.session.user || !req.session.user.logged) {
  //         return reject("You must be logged in");
  //       }
  //       if (
  //         account &&
  //         account.role !== "admin" &&
  //         req.session.user.role === "admin"
  //       ) {
  //         req.session.user.impersonate = {
  //           logged: true,
  //           impersonate: true,
  //           id: account._id,
  //           username: account.username,
  //           email: account.email,
  //           picture: "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //           role: account.role,
  //         };
  //         req.session.save(() => {
  //           resolve();
  //         });
  //       } else {
  //         ctx.logger.error(
  //           "Account " +
  //           req.session.user.username +
  //           " (" +
  //           req.session.user.id +
  //           ") tried impersonate account " +
  //           account.email +
  //           " (" +
  //           account._id +
  //           ")",
  //           null,
  //           true,
  //           req.session.user.id
  //         );
  //         reject("Account don't found or you haven't permission to impersonate.");
  //       }
  //     });
  //   }

  //   async authWithProvider(provider: string, req: Request, res: Response) {
  //     const ctx = this;
  //     const account = await ctx.account.getAccountByProvider(
  //       provider,
  //       req.user["id"]
  //     );

  //     if (account && !account.verified_email) {
  //       req.session.error = "ACCOUNT_EMAIL_NOT_VERIFIED";
  //       delete req.session.passport;
  //       req.session.save(() => {
  //         res.redirect(req.session.redirectTo);
  //       });
  //       return;
  //     }
  //     if (account && account.enabled2fa) {
  //       ctx.logger.info("Account have 2fa", null, true);
  //       req.session.action = {
  //         type: "multifactor",
  //         multifactor: {
  //           type: "2fa",
  //           accountId: account._id,
  //           provider: provider,
  //         },
  //       };
  //       delete req.session.passport;
  //       req.session.save(() => {
  //         res.redirect(req.session.redirectTo);
  //       });
  //       return;
  //     }
  //     switch (provider) {
  //       case "discord":
  //         if (account) {
  //           ctx.logger.success(
  //             account.username + " logged successful in OAuth",
  //             null,
  //             true
  //           );

  //           req.session.user = {
  //             logged: true,
  //             provider: "discord",
  //             id: account._id,
  //             username: account.username,
  //             email: account.email,
  //             picture: "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //           };

  //           if (req.session.action && req.session.action.type === "connection") {
  //             await account.providers.push({
  //               provider: req.session.action.provider,
  //               uid: req.session.action.id,
  //             });
  //             await account.save();
  //             delete req.session.action;
  //           }

  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#logged=true"
  //             );
  //           });
  //         } else {
  //           const accountByEmail = await this.account.getAccountByEmail(
  //             req.user["email"]
  //           );
  //           if (accountByEmail) {
  //             req.session.action = {
  //               type: "connection",
  //               provider: "discord",
  //               id: req.user["id"],
  //               email: req.user["email"],
  //             };
  //           } else {
  //             ctx.logger.error(req.user["email"] + " isn't registered");
  //             req.session.action = {
  //               type: "signup",
  //               provider: "discord",
  //               id: req.user["id"],
  //               email: req.user["email"],
  //             };
  //           }
  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#check=true"
  //             );
  //           });
  //         }
  //         break;
  //       case "google":
  //         if (account) {
  //           const loginFields = [
  //             { name: "ID", value: account._id },
  //             { name: "Username", value: account.username },
  //             { name: "Provider", value: "Google" },
  //           ];
  //           const embed = ctx.discord.createEmbed(
  //             null,
  //             "A new login in the system.",
  //             "00931f",
  //             loginFields,
  //             "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //             "RutsuKun Accounts Notifier"
  //           );
  //           ctx.discord.sendMessageToChannel("737721370921664652", embed);

  //           ctx.logger.success(
  //             account.username + " logged successful in OAuth",
  //             null,
  //             true
  //           );

  //           req.session.user = {
  //             logged: true,
  //             provider: "google",
  //             id: account._id,
  //             username: account.username,
  //             email: account.email,
  //             picture: "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //           };

  //           if (req.session.action && req.session.action.type === "connection") {
  //             await account.providers.push({
  //               provider: req.session.action.provider,
  //               uid: req.session.action.id,
  //             });
  //             await account.save();
  //             delete req.session.action;
  //           }

  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#logged=true"
  //             );
  //           });
  //         } else {
  //           const accountByEmail = await this.account.getAccountByEmail(
  //             req.user["email"]
  //           );
  //           if (accountByEmail) {
  //             req.session.action = {
  //               type: "connection",
  //               provider: "google",
  //               id: req.user["id"],
  //               email: req.user["email"],
  //             };
  //           } else {
  //             ctx.logger.error(req.user["email"] + " isn't registered");
  //             req.session.action = {
  //               type: "signup",
  //               provider: "google",
  //               id: req.user["id"],
  //               email: req.user["email"],
  //             };
  //           }
  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#check=true"
  //             );
  //           });
  //         }
  //         break;
  //       case "steam":
  //         if (account) {
  //           const loginFields = [
  //             { name: "ID", value: account._id },
  //             { name: "Username", value: account.username },
  //             { name: "Provider", value: "Steam" },
  //           ];
  //           const embed = ctx.discord.createEmbed(
  //             null,
  //             "A new login in the system.",
  //             "00931f",
  //             loginFields,
  //             "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //             "RutsuKun Accounts Notifier"
  //           );
  //           ctx.discord.sendMessageToChannel("737721370921664652", embed);

  //           ctx.logger.success(
  //             account.username + " logged successful in OAuth",
  //             null,
  //             true
  //           );

  //           req.session.user = {
  //             logged: true,
  //             provider: "steam",
  //             id: account._id,
  //             username: account.username,
  //             email: account.email,
  //             picture: "https://cdn-dev.rainingdreams.to/avatars/" + account._id,
  //           };

  //           if (req.session.action && req.session.action.type === "connection") {
  //             await account.providers.push({
  //               provider: req.session.action.provider,
  //               uid: req.session.action.provider.id,
  //             });
  //             await account.save();
  //             delete req.session.action;
  //           }

  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#logged=true"
  //             );
  //           });
  //         } else {
  //           req.session.action = {
  //             type: "signup",
  //           };
  //           delete req.session.passport;
  //           req.session.save(() => {
  //             res.redirect(
  //               "https://auth-dev.rainingdreams.to/callback#check=true"
  //             );
  //           });
  //         }
  //         break;
  //     }
  //   }
}

export interface SigninData {
  email: string;
  password: string;
  captcha?: string;
}

export interface ReAuthData {
  type?: string;
  email: string;
  password: string;
  ip?: string;
  country?: string;
  city?: string;
  captcha: string;
}

export interface MultifactorData {
  type?: string;
  code: string;
  provider?: string;
  ip?: string;
  country?: string;
  city?: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  repassword: string;
}

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

export interface ResData {
  access_token?: string;
  type?: string;
  id_token?: string;
  code?: string;
  state?: string;
  nonce?: string;
}
