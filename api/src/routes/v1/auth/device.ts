import { Request, Response } from "express";
import { SessionService } from "@services/SessionService";
import { OAuth2Service } from "@services/OAuth2Service";
import { Req, Res } from "@tsed/common";
import { HTTPCodes } from "@utils";
import { ClientService } from "@services/ClientService";

export const POST_AuthDeviceRoute = (
  sessionService: SessionService,
  oauth: OAuth2Service,
  client: ClientService
) => {
  return async (req: Req, res: Res) => {
    const user_code = req.body.user_code || null;
    const session = sessionService.setSession(req);
    const deviceToken = await oauth.getDeviceTokenByUserCode(user_code);

    if (!deviceToken) {
      res.status(HTTPCodes.BadRequest).json({
        type: "invalid_request",
        description: "no matching user_code found",
      });
    }

    const findClient = await client.getClientByClientId(deviceToken.client_id);

    if (findClient && !findClient.consent) {
      oauth
        .authorize({
          accountId: session.getUser.id,
          client: findClient,
          consentGiven: true,
          deviceCodeData: deviceToken,
        })
        .then((data: any) => {
          switch (data.type) {
            case "authorized":
              res.status(200).json({
                type: data.type,
              });
              break;
            case "multifactor":
              res.status(200).json({
                type: data.type,
                multifactor: data.multifactor,
              });
              break;
            case "error":
              const resErrorRes = {
                type: "error",
                error: data.error,
                errors: data.errors,
                requestId: req.id,
              };
              res.status(400).json(resErrorRes);
              break;
            default:
              const resError = {
                type: "error",
                error: "invalid_response_type",
              };
              res.status(400).json(resError);
              break;
          }
        });
    }
  };
};
