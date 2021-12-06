import { Request, Response } from "express";

// SERVICES

import { TokenService } from "@services/TokenService";
import { LoggerService } from "@services/LoggerService";
import { AccountsService } from "@services/AccountsService";
import { ClientService } from "@services/ClientService";
import { OAuth2Service } from "@services/OAuth2Service";

import { HTTPCodes } from "@utils";

// OAUTH2 FLOWS
import { oAuth2AuthorizationCodeFlow } from "./AuthorizationCodeFlow";
import { oAuth2ClientCredentials } from "./ClientCredentialsFlow";
import { oAuth2DeviceCode } from "./DeviceCodeFlow";

export const POST_TokenRoute = (
  logger: LoggerService,
  client: ClientService,
  token: TokenService,
  account: AccountsService,
  oauth: OAuth2Service
) => {
  return async (req: Request, res: Response) => {
    const grant_type = req.body.grant_type || "";

    switch (grant_type) {
      case "authorization_code":
        oAuth2AuthorizationCodeFlow(logger, client, token, account)(req, res);
        break;
      case "client_credentials":
        oAuth2ClientCredentials(logger, client, token)(req, res);
        break;
      case "device_code":
        oAuth2DeviceCode(logger, client, token, oauth)(req, res);
        break;
      default:
        logger.error("Invalid grant type", null, true);
        res.status(HTTPCodes.BadRequest).json({
          error: "unsupported_grant_type",
          error_description: `Unsupported grant type: ${grant_type}`,
        });
        break;
    }
  };
};
