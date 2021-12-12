import { Req, Res } from "@tsed/common";
import { verifyChallenge } from "pkce-challenge";
import { AccountsService } from "@services/AccountsService";
import { ClientService } from "@services/ClientService";
import { LoggerService } from "@services/LoggerService";
import { TokenService } from "@services/TokenService";

import { HTTPCodes } from "@utils";
import { Config } from "@config";

const oAuth2AuthorizationCodeFlow = (
  logger: LoggerService,
  client: ClientService,
  token: TokenService,
  account: AccountsService
) => {
  return async (req: Req, res: Res) => {
    const clientFromReq = req.oauthClient;
    const { ip, country, city, eu } = req.ipInfo;
    const {
      grant_type,
      redirect_uri,
      client_secret,
      code_verifier,
      code,
      scope,
    } = req.body;

    let clientSecret;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[0] === "Basic") {
      const base64 = authHeader.split(" ")[1];
      let buff = new Buffer(base64, "base64");
      let clientCredentials = buff.toString("ascii");
      clientSecret = clientCredentials.split(":")[1];
    } else {
      clientSecret = client_secret;
    }

    logger.info(code_verifier ? "Initialized Authorization Code flow with PKCE." : "Initialized Authorization Code flow.", null, false);

    const validRedirectURI = await client.checkClientRedirectUri(clientFromReq, redirect_uri);

    if (!validRedirectURI) {
      logger.error("Client invalid redirect_uri: " + redirect_uri, null, false);

      return res.status(HTTPCodes.BadRequest).json({
        error: "invalid_client",
        error_description: "Invalid redirect_uri",
      });
    }

    const validClientSecret = await client.checkClientSecret(clientFromReq, clientSecret);
    if (!code_verifier && !validClientSecret) {
      return res.status(HTTPCodes.BadRequest).json({
        error: "invalid_client",
        error_description: "Invalid client credentials",
      });
    }

    if (!code) {
      return res.status(HTTPCodes.BadRequest).json({
        error: "invalid_request",
        error_description: "Invalid request",
      });
    }

    try {
      logger.info("Authorization code validation in progress.", null, false);
      const decoded: any = await token.verifyCodeToken(code);

      if (!decoded) {
        logger.error("Authorization code expired.", null, true);
        return res.status(HTTPCodes.BadRequest).json({
          error: "invalid_request",
          error_description: "Invalid request",
        });
      }

      logger.success("Authorization code is fine.", null, true);
      const findAccount = await account.getByUUIDWithRelations(decoded.sub, ["emails",]);
      const scopes = decoded.scp;
      const state = decoded.state;

      logger.info("Generates an Access Token for " + findAccount.username + " (" + findAccount.uuid + ")", null, true);
      let rv1 = Math.floor(Math.random() * Math.floor(254));
      let rv2 = Math.random().toString(36).substr(2, 12);
      let rv3 = Math.floor(Math.random() * Math.floor(81458));
      const access_token = await token.createAccessToken({
        sub: findAccount.uuid,
        client_id: clientFromReq.client_id,
        scopes: scopes,
        jti: rv1 + "-" + rv2 + "-" + rv3,
      });

      logger.success("Access Token generated: " + access_token);

      logger.info("Generates an ID Token for " + findAccount.username + " (" + findAccount.uuid +")", null, true);

      const at_hash = token.createAtHash(access_token, "RS256");
      const c_hash = token.createCHash(code, "RS256");
      const s_hash = token.createSHash("12345", "RS256");
      rv1 = Math.floor(Math.random() * Math.floor(254));
      rv2 = Math.random().toString(36).substr(2, 12);
      rv3 = Math.floor(Math.random() * Math.floor(81458));
      const id_token = await token.createIDToken({
        sub: findAccount.uuid,
        username: findAccount.username,
        picture: findAccount.avatar,
        email: findAccount.getPrimaryEmail(),
        role: findAccount.role,
        banned: findAccount.banned,
        client_id: clientFromReq.client_id,
        country: country,
        scopes: scopes,
        amr: ["pw"],
        acr: "urn:raining:bronze",
        azp: ["raining_auth"],
        jti: rv1 + "-" + rv2 + "-" + rv3,
        at_hash: at_hash,
        c_hash: c_hash,
        s_hash: s_hash,
        nonce: decoded.nonce,
      });

      logger.success("ID Token generated: " + id_token);

      if (decoded.code_challenge) {
        logger.info("Verify a code challenge in progress.");
        const verified = verifyChallenge(code_verifier, decoded.code_challenge);
        if (!verified) {
          logger.error("Code challenge verify failed.", null, true);
          return res.status(HTTPCodes.BadRequest).json({
            error: "invalid_client",
            error_description: "Invalid client credentials",
          });
        }
        logger.success("Code challenge verified.", null, true);
      }

      return res.status(HTTPCodes.OK).json({
        access_token: access_token,
        type: "Bearer",
        expires_in: Config.Token.AccessTokenExp,
        id_token: id_token,
      });
    } catch (err) {
      logger.error(err, null, false);
      return res.status(HTTPCodes.BadRequest).json({
        error: "access_denied",
        error_description: "Invalid request",
      });
    }
  };
};

export { oAuth2AuthorizationCodeFlow };
