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

  @Get("/me")
  @UseBefore(SessionLoggedMiddleware)
  @UseBefore(SessionMiddleware)
  public async getMe(
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const currentAccount = await this.accountsService.getByUUIDWithRelations(
      session.getCurrentSessionAccount.uuid,
      ["emails", "providers", "groups", "authn_methods"]
    );
    delete currentAccount.password;
    delete currentAccount.verifyPassword;

    const res = {
      ...currentAccount,
      authn_methods: currentAccount.authn_methods.map((method)=>{
        return {
          type: method.type,
          enabled: method.enabled
        }
      })
    };

    return timer(400).pipe(map(() => res));

  }

  @Post("/me/emails")
  @UseBefore(SessionMiddleware)
  public async postMeEmails(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const currentAccount = await this.accountsService.getAccountByUUID(
      session.getCurrentSessionAccount.uuid
    );

    const email: string = request.body.email;

    if (Validate.isNull(email) || Validate.isEmpty(email)) {
      return response.status(HTTPCodes.NotAcceptable).json({
        error: "Email cannot be empty",
      });
    }

    if (!Validate.isEmail(email)) {
      return response.status(HTTPCodes.NotAcceptable).json({
        error: "Email is invalid",
      });
    }

    const addedEmail = await this.accountsService.addEmail({
      email: email,
      email_verified: false,
      primary: false,
      account: currentAccount,
    });

    delete addedEmail.account;

    response.status(HTTPCodes.Created).json(addedEmail);
  }

  @Delete("/me/emails/:uuid")
  @UseBefore(SessionMiddleware)
  public async deleteMeEmails(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const currentAccount = await this.accountsService.getAccountByUUID(
      session.getCurrentSessionAccount.uuid
    );

    const emailUuid: string = request.params.uuid;

    const deletedEmail = await this.accountsService.deleteEmail(
      emailUuid,
      currentAccount.uuid
    );

    if (deletedEmail.affected) {
      response.status(HTTPCodes.OK).json();
    } else {
      response.status(HTTPCodes.BadRequest).json({
        error: "Something went wrong",
      });
    }
  }
}
