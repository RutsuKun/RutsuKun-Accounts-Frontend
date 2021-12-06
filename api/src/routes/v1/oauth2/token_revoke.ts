import { Req, Res } from "@tsed/common";

import { LoggerService } from "@services/LoggerService";
import { OAuth2Service } from "@services/OAuth2Service";
import { AccessTokenData, TokenService } from "@services/TokenService";

import { HTTP, HTTPCodes } from "@utils";

export const POST_TokenRevokeRoute = (
  logger: LoggerService,
  oauth: OAuth2Service,
  tokenService: TokenService
) => {
  return async (req: Req, res: Res) => {
    const {
      token,
      token_type_hint,
    }: { token: string; token_type_hint: "access_token" | "refresh_token" } =
      req.body;

    if (
      token_type_hint === "access_token" ||
      token_type_hint === "refresh_token"
    ) {
      if (!token) {
        HTTP.OAuth2InvalidRequest(req, res, "Bad Request");
      } else {
        switch (token_type_hint) {
          case "access_token":
            try {
              const tokenData = tokenService.verifyAccessToken(
                token
              ) as AccessTokenData;

              const isRevoked = await tokenService.checkAccessTokenIsRevoked(
                tokenData.jti
              );
              if (isRevoked) {
                HTTP.OAuth2InvalidRequest(
                  req,
                  res,
                  `access token already revoked`
                );
              } else {
                await tokenService.revokeAccessToken({
                  type: "access_token",
                  jti: tokenData.jti,
                  aud: tokenData.aud,
                  sub: tokenData.sub,
                  exp: tokenData.exp,
                });

                return res.status(200).json({
                  success: true,
                });
              }
            } catch (err) {
              return res.status(200).json({
                error: "invalid_request",
                error_description: "Invalid token",
              });
            }

            break;
          default:
            HTTP.OAuth2InvalidRequest(
              req,
              res,
              `token_type_hint refresh_token not supported yet`
            );
            break;
        }
      }
    } else {
      HTTP.OAuth2InvalidRequest(
        req,
        res,
        `Invalid token_type_hit argument${
          token_type_hint ? ": " + token_type_hint : ""
        }`
      );
    }
  };
};
