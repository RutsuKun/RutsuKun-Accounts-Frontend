import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { Context, Req, Res, UseBefore } from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { AccountsService } from "@services/AccountsService";

@Controller("/me/sessions")
export class MeSessionsRoute {
  constructor(private accountsService: AccountsService) {}

  @Get("/")
  @UseBefore(SessionMiddleware)
  public async getSessionsMe(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const sessions = await this.accountsService.getMeSessionsEndpoint(session.getCurrentSessionAccount.uuid);
    response.status(200).json(sessions)
  }

  @Get("/browser")
  @UseBefore(SessionMiddleware)
  public async getSessionsBrowser(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const sessions = await this.accountsService.getBrowserSessionsEndpoint(session.getCurrentBrowserSession ? session.getCurrentBrowserSession.session_id: null);
    response.status(200).json(sessions)
  }
}
