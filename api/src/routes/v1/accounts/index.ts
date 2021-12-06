import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { SessionMiddleware } from "@middlewares/session.middleware";
import routes from "@routes";

@Controller("/accounts")
export class IndexRoute {
  public endpoints = routes.v1.endpoints.AccountsRouteEndpoints;
  constructor(@Inject() private accountsService: AccountsService) {}

  @Get("/")
  @UseBefore(new ScopeMiddleware().use(["accounts:read"]))
  @UseBefore(AccessTokenMiddleware)
  public async getIndex(req: Request, res: Response, next: NextFunction) {
    const accounts = await this.accountsService.listAccountsEndpoint();
    return res.status(200).json(accounts);
  }

  @Get("/me")
  @UseBefore(SessionMiddleware)
  public async getMe() {
    return this.endpoints.GET_AccountsMeRoute(this.accountsService);
  }

  @Post("/me/emails")
  @UseBefore(SessionMiddleware)
  public async postMeEmails() {
    return this.endpoints.POST_AccountsMeEmailRoute(this.accountsService);
  }

  @Delete("/me/emails/:id")
  @UseBefore(SessionMiddleware)
  public async deleteMeEmails() {
    return this.endpoints.DELETE_AccountsMeEmailRoute(this.accountsService);
  }
}
