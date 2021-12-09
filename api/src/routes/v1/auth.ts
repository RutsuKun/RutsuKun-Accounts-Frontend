import { Controller, Inject } from "@tsed/di";
import { Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { AuthService } from "@services/AuthService";
import { SessionService } from "@services/SessionService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";
import { Req, Res, UseBefore } from "@tsed/common";
import { LoggerService } from "@services/LoggerService";
import { HTTPCodes } from "@utils";
import { SessionMiddleware } from "@middlewares/session.middleware";

@Controller("/auth")
export class AuthRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });

  constructor(
    @Inject() private sessionService: SessionService,
    @Inject() private accountsService: AccountsService,
    @Inject() private authService: AuthService,
    @Inject() private oauthService: OAuth2Service,
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService
  ) {}

  @Post()
  public getIndex(@Req() request: Req, @Res() response: Res) {
    const session = this.sessionService.setSession(request);

    if (this.sessionService.getAction === "signup") {
      this.sessionService.delAction();
      this.sessionService.saveSession();
      return response.status(200).json({
        type: "signup",
      });
    }

    this.sessionService.saveSession();

    if (this.sessionService.getUser.logged) {
      session
        .needReAuth()
        .then(() => {
          if (this.sessionService.getFlow === "auth") {
            return response.status(200).json({
              type: "logged-in",
            });
          } else if (this.sessionService.getFlow === "oauth") {
            this.oauthService.checkConsent(request, response);
          }
        })
        .catch((err) => {
          return response.status(400).json(err);
        });
    } else {
      if (this.sessionService.getError) {
        const error = this.sessionService.getError;
        this.sessionService.delError().saveSession();
        return response.status(400).json({
          type: "error",
          error: error,
        });
      }

      if (
        this.sessionService.getAction &&
        this.sessionService.getAction.type === "signup"
      ) {
        const email = this.sessionService.getAction.email;
        this.sessionService.setAction({ type: "signup-connection" });
        this.sessionService.saveSession();
        response.status(200).json({
          type: "signup",
          email: email,
        });
        return;
      }
      return response.status(200).json({
        type: "auth",
      });
    }
  }

  @Post("/signin")
  @UseBefore(SessionMiddleware)
  public async postSignIn(@Req() request: Req, @Res() response: Res) {
    const { email, password, captcha } = request.body;
    const session = this.sessionService.getSession;
    const data = await this.authService.signin(
      { email, password, captcha },
      this.sessionService
    );

    switch (data.type) {
      case "logged-in":
        console.log(3);

        if (this.sessionService.getFlow === "auth") {
          return response.status(200).json({
            type: "logged-in",
          });
        } else if (this.sessionService.getFlow === "oauth") {
          this.oauthService.checkConsent(request, response);
        }
        break;
      case "multifactor":
        response.status(HTTPCodes.OK).json({
          type: data.type,
          multifactor: data.multifactor,
        });
        break;
      case "error":
        response.status(HTTPCodes.BadRequest).json({
          type: "error",
          error: data.error,
          errors: data.errors,
          requestId: request.id,
        });
        break;
      default:
        response.status(HTTPCodes.InternalServerError).json({
          type: "error",
          error: "invalid_response_type",
        });
        break;
    }
  }

  @Post("/signup")
  public async postSignUp(@Req() request: Req, @Res() response: Res) {
    const { email, username, password, repassword } = request.body;
    try {
      await this.accountsService.signup({
        username,
        password,
        repassword,
        email,
      });
      response.status(200).json({
        type: "account_created",
      });
    } catch (err) {
      response.status(200).json({
        type: "error",
        error: err,
      });
    }
  }

  @Post("/reauth")
  public postReAuth(@Req() request: Req, @Res() response: Res) {
    const session = this.sessionService.setSession(request);
    const { password, captcha } = request.body;
    const { ip, country, city, eu } = request.ipInfo;
    this.authService
      .reauth(
        { ip, country, city, email: session.getUser.email, captcha, password },
        session
      )
      .then((data: any) => {
        switch (data.type) {
          case "check":
            this.oauthService.checkConsent(request, response);
            break;
          case "error":
            const resErrorRes = {
              type: "error",
              error: data.error,
              country: country,
            };
            response.status(200).json(resErrorRes);
            break;
          default:
            response.status(200).json({
              type: "error",
              error: "invalid_response_type",
            });
            break;
        }
      });
  }

  @Post("/device")
  public async postDevice(@Req() request: Req, @Res() response: Res) {
    const user_code = request.body.user_code || null;
    const session = this.sessionService.setSession(request);
    const deviceToken = await this.oauthService.getDeviceTokenByUserCode(
      user_code
    );

    if (!deviceToken) {
      response.status(HTTPCodes.BadRequest).json({
        type: "invalid_request",
        description: "no matching user_code found",
      });
    }

    const findClient = await this.clientService.getClientByClientId(
      deviceToken.client_id
    );

    if (findClient && !findClient.consent) {
      this.oauthService
        .authorize({
          accountId: session.getUser.id,
          client: findClient,
          consentGiven: true,
          deviceCodeData: deviceToken,
        })
        .then((data: any) => {
          switch (data.type) {
            case "authorized":
              response.status(200).json({
                type: data.type,
              });
              break;
            case "multifactor":
              response.status(200).json({
                type: data.type,
                multifactor: data.multifactor,
              });
              break;
            case "error":
              const resErrorRes = {
                type: "error",
                error: data.error,
                errors: data.errors,
                requestId: request.id,
              };
              response.status(400).json(resErrorRes);
              break;
            default:
              response.status(400).json({
                type: "error",
                error: "invalid_response_type",
              });
              break;
          }
        });
    }
  }
}
