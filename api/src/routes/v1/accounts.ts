import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { Context, Req, Res, UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { SessionLoggedMiddleware, SessionMiddleware } from "@middlewares/session.middleware";
import { SessionService } from "@services/SessionService";
import { HTTPCodes, Validate } from "@utils";
import { map, timer } from "rxjs";

@Controller("/accounts")
export class AccountsRoute {

  constructor(private accountsService: AccountsService) {}

  @Get("/")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["accounts:read"]))
  public async getIndex(
    @Res() res: Response
  ) {
    const accounts = await this.accountsService.listAccountsEndpoint();
    return res.status(200).json(accounts);
  }

}
