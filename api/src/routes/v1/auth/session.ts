import { Controller, Inject } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { Req, Res } from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { LoggerService } from "@services/LoggerService";

@Controller("/auth/session")
export class AuthSessionRoute {
  public logger = this.loggerService.child({
    label: {
      name: "Auth Endpoint",
      type: "auth",
    },
  });

  constructor(
    @Inject() private sessionService: SessionService,
    @Inject() private loggerService: LoggerService
  ) {}

  @Get("/")
  public getSession(@Req() request: Req, @Res() response: Res) {
    if (this.sessionService.session && this.sessionService.getUser) {
      //   if (req.session.user.impersonate) {
      //     return res.status(200).json(req.session.user.impersonate);
      //   }
      response.status(200).json(this.sessionService.getUser);
    } else {
      response.status(200).json({ logged: false });
    }
  }

  @Get("/details")
  public getSessionDetails(@Req() request: Req, @Res() response: Res) {
    response.status(200).json(request.session);
  }

  @Get("/end")
  public getSessionEnd(@Req() request: Req, @Res() response: Res) {
    const { id_token_hint, post_logout_redirect_uri } = request.query;
    if (!post_logout_redirect_uri) {
      response.status(200).json({
        type: "error",
        error: "invalid_request",
        error_description: "Parameter post_logout_redirect_uri required",
      });
    }

    if (this.sessionService.getUser && this.sessionService.getUser.id) {
      this.sessionService
        .setUser({ logged: false })
        .delPassport()
        .delAction()
        .saveSession();
    }

    return response.redirect(post_logout_redirect_uri as string);
  }

  @Post("/end")
  public postSessionEnd(@Req() request: Req, @Res() response: Res) {
    if (this.sessionService.getUser && this.sessionService.getUser.id) {
      /**if(req.session.user.impersonate){
				delete req.session.user.impersonate;
				return res.status(200).json({
					type: "impersonate", 
					action: "logged-out"
				})
			}**/

      this.sessionService
        .setUser({ logged: false })
        .delPassport()
        .delAction()
        .delIDC()
        .saveSession();

      response.status(200).json(this.sessionService.getUser);
    } else {
      response.status(200).json({ logged: false });
    }
  }
}
