import { Req, Res } from "@tsed/common";

import { TokenService } from "@services/TokenService";
import { ClientService } from "@services/ClientService";
import { LoggerService } from "@services/LoggerService";
import { OAuth2Service } from "@services/OAuth2Service";

import { HTTPCodes } from "@utils";

const oAuth2DeviceCode = (
  logger: LoggerService,
  client: ClientService,
  token: TokenService,
  oauth: OAuth2Service
) => {
  return async (req: Req, res: Res) => {
    const clientFromReq = req.oauthClient;
    const device_code = req.body.device_code;
    try {
      const deviceCode = await oauth.getDeviceToken(
        device_code,
        clientFromReq.client_id
      );

      const currentTime = Math.round(Date.now() / 1000);

      if (!deviceCode) {
        res.status(HTTPCodes.BadRequest).json({
          error: "bad_verification_code",
          error_description:
            "The device_code sent to the /token endpoint wasn't recognized.",
        });
      } else if (currentTime > Number(deviceCode.expires_at)) {
        res.status(HTTPCodes.BadRequest).json({
          error: "expired_token",
          error_decsription:
            "At least expires_in seconds have passed, and authentication is no longer possible with this device_code.",
        });
      } else if (!deviceCode.authorized && !deviceCode.denied) {
        res.status(HTTPCodes.OK).json({
          error: "authorization_pending",
          error_description:
            "The user hasn't finished authenticating, but hasn't canceled the flow.",
        });
      } else if (deviceCode.denied) {
        res.status(HTTPCodes.BadRequest).json({
          error: "authorization_declined",
          error_description: "The end user denied the authorization request.",
        });
      } else if (deviceCode.authorized) {
        const response = await oauth.getToken({
          grant_type: "device_code",
          redirect_uri: null,
          city: null,
          country: null,
          client: clientFromReq,
          clientSecret: null,
          code: null,
          code_verifier: null,
          ip: null,
          scope: null,
          deviceCodeData: deviceCode,
        });
        res.status(HTTPCodes.OK).json(response);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export { oAuth2DeviceCode };
