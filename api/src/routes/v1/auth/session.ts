import { Controller, Inject } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { Context, Req, Res, Use, UseBefore } from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { LoggerService } from "@services/LoggerService";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { AuthService } from "@services/AuthService";

@Controller("/auth/session")
export class AuthSessionRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });

  constructor(
    @Inject() private loggerService: LoggerService,
    private authService: AuthService
  ) {}

  @Get("/")
  @UseBefore(SessionMiddleware)
  public async getSession(
    @Req() request: Req,
    @Res() response: Res,
    @Context('session') session: SessionService
  ) {
    if (session && session.getUser && session.getUser.logged) {
      //   if (req.session.user.impersonate) {
      //     return res.status(200).json(req.session.user.impersonate);
      //   }
      const acr_values = session.getFlow === 'auth' ? 'urn:rutsukun:gold' : session.getClientQuery.acr_values;
      if(!!await this.authService.checkMfaAuthnRequired(session.getUser.id, session, acr_values)) return response.status(200).json({ logged: false });

      response.status(200).json(session.getUser);
    } else {
      response.status(200).json({ logged: false });
    }
  }

  @Get("/details")
  @Use(SessionMiddleware)
  public getSessionDetails(@Req() request: Req, @Res() response: Res, @Context('session') session: SessionService) {
    response.status(200).json(session.session);
  }

  @Get("/end")
  @UseBefore(SessionMiddleware)
  public async getSessionEnd(@Req() request: Req, @Res() response: Res, @Context('session') session: SessionService) {
    const { id_token_hint, post_logout_redirect_uri } = request.query;
    if (!post_logout_redirect_uri) {
      response.status(200).json({
        type: "error",
        error: "invalid_request",
        error_description: "Parameter post_logout_redirect_uri required",
      });
    }

    if (session.getUser && session.getUser.id) {
      await session
        .setUser({ logged: false })
        .delPassport()
        .delAction()
        .saveSession();
    }

    return response.redirect(post_logout_redirect_uri as string);
  }

  @Post("/end")
  @UseBefore(SessionMiddleware)
  public async postSessionEnd(
    @Req() request: Req,
    @Res() response: Res,
    @Context('session') session: SessionService
  ) {
    if (session.getUser && session.getUser.id) {
      /**if(req.session.user.impersonate){
				delete req.session.user.impersonate;
				return res.status(200).json({
					type: "impersonate", 
					action: "logged-out"
				})
			}**/

      const newSession = session.setUser({ logged: false }).delPassport().delAction().delIDP();
      console.log('newSession', newSession);

      await newSession.saveSession();
      

      response.status(200).json(newSession.getUser);
    } else {
      response.status(200).json({ logged: false });
    }
  }
}
