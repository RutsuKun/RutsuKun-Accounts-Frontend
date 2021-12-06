import { AccountsService } from "@services/AccountsService";
import { SessionService } from "@services/SessionService";
import { Req, Res } from "@tsed/common";
import { HTTPCodes, Validate } from "@utils";

export const GET_AccountsMeRoute = (accountsService: AccountsService) => {
  return async (req: Req, res: Res) => {
    const session = req.userSession as SessionService;
    const currentAccount = await accountsService.getByUUIDWithRelations(
      session.getUser.id,
      ["emails", "providers"]
    );
    delete currentAccount.password;
    delete currentAccount.verifyPassword;
    res.status(HTTPCodes.OK).json(currentAccount);
  };
};

export const POST_AccountsMeEmailRoute = (accountsService: AccountsService) => {
  return async (req: Req, res: Res) => {
    const session = req.userSession as SessionService;
    const currentAccount = await accountsService.getAccountByUUID(
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

    const addedEmail = await accountsService.addEmail({
      email: email,
      email_verified: false,
      primary: false,
      account: currentAccount,
    });

    delete addedEmail.account;

    res.status(HTTPCodes.Created).json(addedEmail);
  };
};

export const DELETE_AccountsMeEmailRoute = (
  accountsService: AccountsService
) => {
  return async (req: Req, res: Res) => {
    const session = req.userSession as SessionService;
    const currentAccount = await accountsService.getAccountByUUID(
      session.getUser.id
    );

    const emailId: string = req.params.id;

    const deletedEmail = await accountsService.deleteEmail(
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
  };
};
