import { Req, Res } from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { AuthService } from "@services/AuthService";
import { OAuth2Service } from "@services/OAuth2Service";

import { HTTPCodes } from "@utils";

export const POST_SignInRoute = (
  sessionService: SessionService,
  authService: AuthService,
  oauth: OAuth2Service
) => {
  return (req: Req, res: Res) => {
    const { email, password, captcha } = req.body;
    const session = sessionService.setSession(req);

    authService
      .signin({ email, password, captcha }, session)
      .then((data: any) => {
        switch (data.type) {
          case "logged-in":
            if (session.getFlow == "auth") {
              return res.status(200).json({
                type: "logged-in",
              });
            } else if (session.getFlow === "oauth") {
              oauth.checkConsent(req, res);
            }
            break;
          case "multifactor":
            res.status(HTTPCodes.OK).json({
              type: data.type,
              multifactor: data.multifactor,
            });
            break;
          case "error":
            res.status(HTTPCodes.BadRequest).json({
              type: "error",
              error: data.error,
              errors: data.errors,
              requestId: req.id,
            });
            break;
          default:
            res.status(HTTPCodes.InternalServerError).json({
              type: "error",
              error: "invalid_response_type",
            });
            break;
        }
      });
  };
};
