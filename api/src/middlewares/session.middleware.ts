import {
  Inject,
  InjectorService,
  Middleware,
  Next,
  Req,
  Res,
} from "@tsed/common";

import { SessionService } from "@services/SessionService";

@Middleware()
export class SessionMiddleware {
  private sessionService: SessionService;

  @Inject()
  injector: InjectorService;

  constructor() {}

  $onInit() {
    this.sessionService = this.injector.get<SessionService>(SessionService);
  }

  use(@Req() req: Req, @Res() res: Res, @Next() next: Next) {
    const session = this.sessionService.setSession(req);
    if (!req.session.user || !req.session.user.logged) {
      session.setUser({ logged: false });
    }
    req.userSession = session;
    next();
  }
}
