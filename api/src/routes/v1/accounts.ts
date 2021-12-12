import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post } from "@tsed/schema";
import { AccountsService } from "@services/AccountsService";
import { Req, Res, UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { SessionService } from "@services/SessionService";
import { HTTPCodes, Validate } from "@utils";

@Controller("/accounts")
export class AccountsRoute {

  constructor(@Inject() private accountsService: AccountsService) {}

  @Get("/")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["accounts:read"]))
  public async getIndex(req: Request, res: Response, next: NextFunction) {
    const accounts = await this.accountsService.listAccountsEndpoint();
    return res.status(200).json(accounts);
  }

  @Get("/me")
  @UseBefore(SessionMiddleware)
  public async getMe(@Req() req: Req, @Res() res: Res) {
    const session = req.userSession as SessionService;
    const currentAccount = await this.accountsService.getByUUIDWithRelations(
      session.getUser.id,
      ["emails", "providers"]
    );
    delete currentAccount.password;
    delete currentAccount.verifyPassword;
    res.status(HTTPCodes.OK).json(currentAccount);
  }

  @Post("/me/emails")
  @UseBefore(SessionMiddleware)
  public async postMeEmails(@Req() req: Req, @Res() res: Res) {
    const session = req.userSession as SessionService;
    const currentAccount = await this.accountsService.getAccountByUUID(
      session.getUser.id
    );

    const email: string = req.body.email;

    if (Validate.isNull(email) || Validate.isEmpty(email)) {
      return res.status(HTTPCodes.NotAcceptable).json({
        error: "Email cannot be empty",
      });
    }

    if (!Validate.isEmail(email)) {
      return res.status(HTTPCodes.NotAcceptable).json({
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

    res.status(HTTPCodes.Created).json(addedEmail);
  }

  @Delete("/me/emails/:id")
  @UseBefore(SessionMiddleware)
  public async deleteMeEmails(@Req() req: Req, @Res() res: Res) {
    const session = req.userSession as SessionService;
    const currentAccount = await this.accountsService.getAccountByUUID(
      session.getUser.id
    );

    const emailId: string = req.params.id;

    const deletedEmail = await this.accountsService.deleteEmail(
      emailId,
      currentAccount.uuid
    );

    if (deletedEmail.affected) {
      res.status(HTTPCodes.NoContent).json();
    } else {
      res.status(HTTPCodes.BadRequest).json({
        error: "Something went wrong",
      });
    }
  }
}
