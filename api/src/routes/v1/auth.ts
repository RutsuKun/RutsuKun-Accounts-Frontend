import { Controller, Inject } from "@tsed/di";
import { Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { AuthService } from "@services/AuthService";
import { SessionService } from "@services/SessionService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";
import { BodyParams, Context, Req, Res, Use, UseBefore } from "@tsed/common";
import { LoggerService } from "@services/LoggerService";
import { HTTPCodes } from "@utils";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { TokenService } from "@services/TokenService";

@Controller("/auth")
export class AuthRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });

  constructor(
    @Inject() private accountsService: AccountsService,
    @Inject() private authService: AuthService,
    @Inject() private oauthService: OAuth2Service,
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService
  ) {}

  @Post()
  @UseBefore(SessionMiddleware)
  public async getIndex(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    
    if (session.getAction === "signup") {
      session.delAction();
      session.saveSession();
      return response.status(200).json({
        type: "signup",
      });
    }

    session.saveSession();

    if (session.getUser.logged) {
      const needReauth = await session.needReAuth();
      if (needReauth) {
        return response.status(400).json({ type: "reauth" });
      }

      if (session.getFlow === "auth") {

        const multifactorRequired = await this.authService.checkMfaAuthnRequired(session.getUser.id, session, 'urn:rutsukun:gold');

        if(multifactorRequired && multifactorRequired.type === 'multifactor') {
          return response.status(200).json(multifactorRequired);
        }

        return response.status(200).json({ type: "logged-in" });
      } else if (session.getFlow === "oauth") {

        // refactor
        const multifactorRequired = await this.authService.checkMfaAuthnRequired(session.getUser.id, session, session.getClientQuery.acr_values);

        if(multifactorRequired && multifactorRequired.type === 'multifactor') {
          return response.status(200).json(multifactorRequired);
        }

        this.oauthService.checkConsent(request, response);
      }
    } else {
      if (session.getError) {
        const error = session.getError;
        session.delError().saveSession();
        return response.status(400).json({
          type: "error",
          error: error,
        });
      }

      if (
        session.getAction &&
        session.getAction.type === "signup"
      ) {
        const email = session.getAction.email;
        session.setAction({ type: "signup-connection" });
        session.saveSession();
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
  public async postSignIn(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {

    const { email, password, captcha } = request.body;

    const data = await this.authService.signin({ email, password, captcha }, session);

    switch (data.type) {
      case "logged-in":

        if (session.getFlow === "auth") {

          const multifactorRequired = await this.authService.checkMfaAuthnRequired(session.getUser.id, session, "urn:rutsukun:gold");

          if(multifactorRequired && multifactorRequired.type === 'multifactor') {
            return response.status(200).json(multifactorRequired);
          }

          return response.status(200).json({
            type: "logged-in",
          });
        } else if (session.getFlow === "oauth") {
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
      response.status(400).json({
        type: "error",
        error: err,
      });
    }
  }

  @Post("/reauth")
  @Use(SessionMiddleware)
  public async postReAuth(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const { password, captcha } = request.body;
    const { ip, country, city, eu } = request.ipInfo;

    if(!session.getUser.logged) {
      return response.status(HTTPCodes.OK).json({ type: 'auth' });
    }

    const data = await this.authService.reauth(
      { ip, country, city, email: session.getUser.email, captcha, password },
      session
    );
    switch (data.type) {
      case "logged-in":
        if (session.getFlow === "auth") {
          return response.status(200).json({
            type: "logged-in",
          });
        } else if (session.getFlow === "oauth") {
          this.oauthService.checkConsent(request, response);
        }
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
  }

  @Post("/device")
  @Use(SessionMiddleware)
  public async postDevice(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const user_code = request.body.user_code || null;
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

  @Post("/multifactor")
  @UseBefore(SessionMiddleware)
  public async postMultifactor(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @BodyParams("code") code: string,
    @BodyParams("token") token: string
  ) {

    const data = await this.authService.multifactor(code, token, session);

    switch (data.type) {
      case "logged-in":

        if (session.getFlow === "auth") {
          return response.status(200).json({
            type: "logged-in",
          });
        } else if (session.getFlow === "oauth") {
          this.oauthService.checkConsent(request, response);
        }
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
}
