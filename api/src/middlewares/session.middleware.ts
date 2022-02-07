import {
  Context,
  Logger,
  Middleware,
  Next,
  ProviderScope,
  Req,
  Res,
  Scope,
} from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { HTTP } from "@utils";

@Middleware()
@Scope(ProviderScope.REQUEST)
export class SessionMiddleware {

  constructor(private sessionService: SessionService) {}

  async use(
    @Req() req: Req,
    @Res() res: Res,
    @Next() next: Next,
    @Context() context: Context
  ) {

    const session = this.sessionService.setSession(req);

    if (!req.session.user || !req.session.user.logged) {
      session.setUser({ logged: false });
      req.user = null;
    } else {
      req.user = {
        emails: [{ value: session.getUser.email }],
        displayName: session.getUser.username,
        name: {
          givenName: null,
          familyName: null,
        },
      };
    }
    req.userSession = session;

    res.cookie('session_state', req.session.id)

    await session.saveSession();

    context.set("session", session);

    next();

  }
}

@Middleware()
@Scope(ProviderScope.REQUEST)
export class SessionLoggedMiddleware {

  async use(
    @Req() request: Req,
    @Res() response: Res,
    @Next() next: Next,
    @Context("logger") logger: Logger,
  ) {

    if (!request.session.user || !request.session.user.logged) return HTTP.Unauthorized(request, response, logger);

    next();

  }
}
