import { Req } from "@tsed/common";

import { URLSearchParams } from "url";
import { SessionService } from "@services/SessionService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";
import { LoggerService } from "@services/LoggerService";
import { Config } from "@config";

export const GET_AuthorizeRoute = (
  oauthService: OAuth2Service,
  sessionService: SessionService,
  clientService: ClientService,
  loggerService: LoggerService
) => {
  return (req, res) => {
    const session = sessionService.setSession(req);
    const authUrl = Config.FRONTEND.url + '/signin';
    let {
      client_id,
      redirect_uri,
      response_type,
      scope,
      nonce,
      state,
      code_challenge,
      code_challenge_method,
      prompt,
      login_hint,
      password_hint,
      display,
      service
    } = req.query;
    const acr_values = req.query.acr_values || "urn:raining:bronze";

    let error = null;

    if (!client_id) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter client_id is required",
        });
      loggerService.error("Parameter client_id is required");
    }

    if (!response_type) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter response_type is required",
        });
      loggerService.error("Parameter response_type is required");
      response_type = "";
    }

    if (!redirect_uri) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter redirect_uri is required",
        });
      loggerService.error("Parameter redirect_uri is required");
    }

    const response_type_check = (response_type as string).split(" ");

    clientService
      .getClientConfiguration(client_id)
      .then(async (configuration) => {

        if (configuration) {
          loggerService.info(
            `Client ${configuration.name} (${configuration.client_id}) is fine`
          );
        }

        if (!configuration.redirect_uris.includes(redirect_uri)) {
          if (!error)
            error = new URLSearchParams({
              error: "invalid_client",
              error_description: "Parameter redirect_uri is invalid",
            });
          loggerService.error("Parameter redirect_uri is invalid");
        } else {
          loggerService.info("Redirect URI '" + redirect_uri + "' is valid");
        }

        response_type_check.forEach((item, index) => {
          if (!configuration.response_types.includes(item)) {
            if (!error)
              error = new URLSearchParams({
                error: "invalid_client",
                error_description: "Response type " + item + " not supported",
              });
          } else {
            loggerService.info("Response type '" + item + "' is valid");
          }

          if (item === "id_token") {
            if (!nonce) {
              if (!error)
                error = new URLSearchParams({
                  error: "invalid_request",
                  error_description: "Parameter nonce required",
                });
              loggerService.error(
                "Parameter nonce is required for client " +
                  configuration.name +
                  " (" +
                  configuration.client_id +
                  ")"
              );
            }
          }
        });

        if (error) {
          session.delClientQuery().delClient().saveSession();
          return res.redirect(authUrl + "?" + error);
        }

        session
          .setClientQuery({
            client_id,
            redirect_uri,
            response_type,
            acr_values,
            scope,
            code_challenge,
            code_challenge_method,
            nonce,
            state,
            prompt,
          })
          .setClient(configuration);

        const params: any = {
          acr_values,
          client_id,
          redirect_uri,
          response_type,
          scope,
          display,
          service
        };

        if (code_challenge) params.code_challenge = code_challenge;
        if (code_challenge_method)
          params.code_challenge_method = code_challenge_method;
        if (nonce) params.nonce = nonce;
        if (state) params.state = state;
        if (prompt) params.prompt = prompt;
        if (login_hint) params.login_hint = login_hint;
        if (password_hint) params.password_hint = password_hint;
        if (prompt === "login") session.delAction();

        if (prompt === "signup") {
          session.setAction("signup");
        }

        session.saveSession();

        const paramsInUri = new URLSearchParams(params);

        if (
          session.getClientQuery.prompt === "none" &&
          session.getUser.logged
        ) {
          const {
            response_type,
            redirect_uri,
            scope,
            code_challenge,
            code_challenge_method,
            nonce,
            state,
          } = session.getClientQuery;

          const accountId = session.getUser.id;
          const client = session.getClient;
          const session_state = session.getIDC.session_id;

          const {
            response: {
              parameters: { uri },
            },
          } = (await oauthService.authorize({
            response_type,
            redirect_uri,
            scope,
            code_challenge,
            code_challenge_method,
            nonce,
            state,
            accountId,
            client,
            consentGiven: true,
            session_state,
          })) as any;

          return res.redirect(uri);
        }

        return res.redirect(authUrl + "?" + paramsInUri);
      })
      .catch((err) => {
        console.log("err", err);

        error = new URLSearchParams({
          error: "invalid_client",
          error_description: "Invalid client",
        });

        return res.redirect(authUrl + "?" + error);
      });
  };
};

export const POST_AuthorizeRoute = (
  session: SessionService,
  oauth: OAuth2Service,
  logger: LoggerService
) => {
  return (req: Req, res) => {
    // const logger = Logger.child({
    // 	label: {
    // 		type: "oauth",
    // 		name: "OAuth2 Server",
    // 	},
    // });

    const { ip, country, city, eu } = req.ipInfo;
    const { consentGiven } = req.body;

    if (!session.getUser.logged) {
      return res.status(200).json({
        type: "error",
        error: "You must be logged as real account",
      });
    }

    session
      .needReAuth()
      .then(() => {
        oauth
          .authorize({
            response_type: session.getClientQuery.response_type,
            redirect_uri: session.getClientQuery.redirect_uri,
            scope: session.getClientQuery.scope,
            accountId: session.getUser.id,
            country,
            nonce: session.getClientQuery.nonce,
            state: session.getClientQuery.state,
            client: session.getClient,
            consentGiven,
            session_state: session.getSession.id,
          })
          .then((data: any) => {
            switch (data.type) {
              case "response":
                const userId = session.getUser.id;
                const userUsername = session.getUser.username;
                logger.success(
                  "Authorized  " + userUsername + " (" + userId + ")"
                );
                logger.info("Response Type: " + data.type);
                logger.info("Response Mode: " + data.response.mode);
                logger.info(
                  "Response Parameter URI: " + data.response.parameters.uri
                );
                return res.status(200).json(data);
                break;
            }
          })
          .catch((error) => {
            return res.status(200).json({
              type: "error",
              error: error,
              reqId: req.id,
            });
          });
      })
      .catch((err) => {
        return res.status(200).json(err);
      });
  };
};
