import { Request, Response } from "express";
import { SessionService } from "@services/SessionService";
import { AuthService } from "@services/AuthService";
import { OAuth2Service } from "@services/OAuth2Service";

export const POST_ReAuthRoute = (
  sessionService: SessionService,
  authService: AuthService,
  oauthService: OAuth2Service
) => {
  return (req: Request, res: Response) => {
    const session = sessionService.setSession(req);
    const { password, captcha } = req.body;
    const { ip, country, city, eu } = req.ipInfo;

    authService
      .reauth(
        { ip, country, city, email: session.getUser.email, captcha, password },
        session
      )
      .then((data: any) => {
        switch (data.type) {
          case "check":
            oauthService.checkConsent(req, res);
            break;
          case "error":
            const resErrorRes = {
              type: "error",
              error: data.error,
              country: country,
            };
            res.status(200).json(resErrorRes);
            break;
          default:
            const resError = {
              type: "error",
              error: "invalid_response_type",
            };
            res.status(200).json(resError);
            break;
        }
      });
  };
};
