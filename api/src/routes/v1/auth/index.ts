import { Controller, Inject } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { AuthService } from "@services/AuthService";
import { SessionService } from "@services/SessionService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";
import { Res, UseBefore } from "@tsed/common";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { LoggerService } from "@services/LoggerService";

import routes from "@routes";

export const POST_AuthIndexRoute = (
  sessionService: SessionService,
  oauth: OAuth2Service
) => {
  return (req, res: Res) => {
    const session = sessionService.setSession(req);

    if (session.getAction === "signup") {
      session.delAction();
      session.saveSession();
      return res.status(200).json({
        type: "signup",
      });
    }

    session.saveSession();

    if (session.getUser.logged) {
      session
        .needReAuth()
        .then(() => {
          if (session.getFlow === "auth") {
            return res.status(200).json({
              type: "logged-in",
            });
          } else if (session.getFlow === "oauth") {
            oauth.checkConsent(req, res);
          }
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
    } else {
      if (session.getError) {
        const error = session.getError;
        session.delError().saveSession();
        return res.status(400).json({
          type: "error",
          error: error,
        });
      }

      if (session.getAction && session.getAction.type === "signup") {
        const email = session.getAction.email;
        session.setAction({ type: "signup-connection" });
        session.saveSession();
        res.status(200).json({
          type: "signup",
          email: email,
        });
        return;
      }
      return res.status(200).json({
        type: "auth",
      });
    }
  };
};

@Controller("/auth")
export class AuthRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });
  public endpoints = routes.v1.endpoints.AuthRoutesEndpoints;
  constructor(
    @Inject() private sessionService: SessionService,
    @Inject() private accountsService: AccountsService,
    @Inject() private authService: AuthService,
    @Inject() private oauthService: OAuth2Service,
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService
  ) {}

  @Post()
  // @UseBefore(OAuthMiddleware)
  getIndex(req, res) {
    return this.endpoints.POST_AuthIndexRoute(
      this.sessionService,
      this.oauthService
    );
  }

  @Get("/providers/:providerId")
  @UseBefore(SessionMiddleware)
  public getProvider(req, res) {
    return this.endpoints.GET_AuthProviderRoute(
      this.sessionService,
      this.authService
    );
  }

  @Get("/providers/:providerId/callback")
  @UseBefore(SessionMiddleware)
  public getProviderCallback(req, res) {
    return this.endpoints.GET_AuthProviderCallbackRoute(
      this.sessionService,
      this.accountsService,
      this.authService,
      this.logger
    );
  }

  @Get("/providers/:providerId/disconnect")
  @UseBefore(SessionMiddleware)
  public getProviderDisconnect(req, res) {
    return this.endpoints.GET_AuthProviderDisconnectRoute(
      this.sessionService,
      this.accountsService,
      this.authService
    );
  }

  @Post("/signin")
  public postSignIn(req, res) {
    return this.endpoints.POST_SignInRoute(
      this.sessionService,
      this.authService,
      this.oauthService
    );
  }

  @Post("/signup")
  public postSignUp(req, res) {
    return this.endpoints.POST_SignUpRoute(this.accountsService);
  }

  @Post("/reauth")
  public postReAuth(req, res) {
    return this.endpoints.POST_ReAuthRoute(
      this.sessionService,
      this.authService,
      this.oauthService
    );
  }

  @Post("/device")
  public postDevice(req, res) {
    return this.endpoints.POST_AuthDeviceRoute(
      this.sessionService,
      this.oauthService,
      this.clientService
    );
  }

  @Get("/session")
  public getSession(req, res) {
    return this.endpoints.GET_AuthSessionRoute(this.sessionService);
  }

  @Get("/session/details")
  public getSessionDetails(req, res) {
    return this.endpoints.GET_AuthSessionDetailsRoute(this.sessionService);
  }

  @Get("/session/end")
  public getSessionEnd(req, res) {
    return this.endpoints.GET_AuthSessionEndRoute(this.sessionService);
  }

  @Post("/session/end")
  public postSessionEnd(req, res) {
    return this.endpoints.POST_AuthSessionEndRoute(this.sessionService);
  }
}
