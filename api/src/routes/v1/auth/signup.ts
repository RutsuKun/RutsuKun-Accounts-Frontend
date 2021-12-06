import { AccountsService } from "@services/AccountsService";

export const POST_SignUpRoute = (accountsService: AccountsService) => {
  return async (req, res) => {
    const { email, username, password, repassword } = req.body;

    try {
      await accountsService.signup({ username, password, repassword, email });
      res.status(200).json({
        type: "account_created",
      });
    } catch (err) {
      res.status(200).json({
        type: "error",
        error: err,
      });
    }
  };
};
