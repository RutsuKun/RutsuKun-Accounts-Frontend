import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseBefore,
} from "@tsed/common";

// MIDDLEWARES

import { CheckClientMiddleware } from "@middlewares/client.middleware";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";

// SERVICES

import { LoggerService } from "@services/LoggerService";
import { SessionService } from "@services/SessionService";
import { AccountsService } from "@services/AccountsService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";

import { HTTPCodes } from "@utils";
import { Config } from "@config";

@Controller("/oauth2")
export class OAuth2Route {
  public logger: LoggerService;
  constructor(
    @Inject() private sessionService: SessionService,
    @Inject() private accountService: AccountsService,
    @Inject() private oauthService: OAuth2Service,
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService
  ) {
    this.logger = this.loggerService.child({
      label: { name: "OAuth2", type: "oauth2" },
    });
  }

  @Get()
  public getIndex(@Req() request: Req, @Res() response: Res) {
    return response.status(HTTPCodes.OK).json({
      message: "RutsuKun Accounts API - OAuth2 Endpoints",
    });
  }

  @Get("/authorize")
  public async getAuthorize(@Req() request: Req, @Res() response: Res) {
    const session = this.sessionService.setSession(request);
    const authUrl = Config.FRONTEND.url + "/signin";
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
      service,
    } = request.query;
    const acr_values = request.query.acr_values || "urn:raining:bronze";

    let error = null;

    if (!client_id) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter client_id is required",
        });
      this.logger.error("Parameter client_id is required");
    }

    if (!response_type) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter response_type is required",
        });
      this.logger.error("Parameter response_type is required");
      response_type = "";
    }

    if (!redirect_uri) {
      if (!error)
        error = new URLSearchParams({
          error: "invalid_request",
          error_description: "Parameter redirect_uri is required",
        });
      this.logger.error("Parameter redirect_uri is required");
    }

    const response_type_check = (response_type as string).split(" ");

    try {
      const configuration = await this.clientService.getClientConfiguration(
        client_id as string
      );
      if (configuration) {
        this.logger.info(
          `Client ${configuration.name} (${configuration.client_id}) is fine`
        );
      }

      if (!configuration.redirect_uris.includes(redirect_uri)) {
        if (!error)
          error = new URLSearchParams({
            error: "invalid_client",
            error_description: "Parameter redirect_uri is invalid",
          });
        this.logger.error("Parameter redirect_uri is invalid");
      } else {
        this.logger.info("Redirect URI '" + redirect_uri + "' is valid");
      }

      response_type_check.forEach((item, index) => {
        if (!configuration.response_types.includes(item)) {
          if (!error)
            error = new URLSearchParams({
              error: "invalid_client",
              error_description: "Response type " + item + " not supported",
            });
        } else {
          this.logger.info("Response type '" + item + "' is valid");
        }

        if (item === "id_token") {
          if (!nonce) {
            if (!error)
              error = new URLSearchParams({
                error: "invalid_request",
                error_description: "Parameter nonce required",
              });
            this.logger.error(
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
        return response.redirect(authUrl + "?" + error);
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
        service,
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

      if (session.getClientQuery.prompt === "none" && session.getUser.logged) {
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
        } = (await this.oauthService.authorize({
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

        return response.redirect(uri);
      }

      return response.redirect(authUrl + "?" + paramsInUri);
    } catch (err) {
      console.log("err", err);

      error = new URLSearchParams({
        error: "invalid_client",
        error_description: "Invalid client",
      });

      return response.redirect(authUrl + "?" + error);
    }
  }

  @Post("/authorize")
  public async postAuthorize(@Req() request: Req, @Res() response: Res) {
    // const logger = Logger.child({
    // 	label: {
    // 		type: "oauth",
    // 		name: "OAuth2 Server",
    // 	},
    // });

    const { ip, country, city, eu } = request.ipInfo;
    const { consentGiven } = request.body;

    if (!this.sessionService.getUser.logged) {
      return response.status(200).json({
        type: "error",
        error: "You must be logged as real account",
      });
    }

    const needReAuth = await this.sessionService.needReAuth();

    if (needReAuth) {
      return response.status(HTTPCodes.OK).json({
        type: "auth",
      });
    }

    try {
      const data = await this.oauthService.authorize({
        response_type: this.sessionService.getClientQuery.response_type,
        redirect_uri: this.sessionService.getClientQuery.redirect_uri,
        scope: this.sessionService.getClientQuery.scope,
        accountId: this.sessionService.getUser.id,
        country,
        nonce: this.sessionService.getClientQuery.nonce,
        state: this.sessionService.getClientQuery.state,
        client: this.sessionService.getClient,
        consentGiven,
        session_state: this.sessionService.getSession.id,
      });

      switch (data.type) {
        case "response":
          const userId = this.sessionService.getUser.id;
          const userUsername = this.sessionService.getUser.username;
          this.logger.success(
            "Authorized  " + userUsername + " (" + userId + ")"
          );
          this.logger.info("Response Type: " + data.type);
          this.logger.info("Response Mode: " + data.response.mode);
          this.logger.info(
            "Response Parameter URI: " + data.response.parameters.uri
          );
          return response.status(200).json(data);
          break;
      }
    } catch (error) {
      return response.status(200).json({
        type: "error",
        error: error,
        reqId: request.id,
      });
    }
  }

  @Post("/device")
  @UseBefore(CheckClientMiddleware)
  public async postDevice(@Req() request: Req, @Res() response: Res) {
    // @ts-ignore
    const client = req.oauthClient;
    const { scope } = request.body;
    const flow = await this.oauthService.runDeviceCodeFlow(
      client.client_id,
      scope
    );
    return response.status(200).json(flow);
  }

  @Get("/userinfo")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["account"], { failWithError: true }))
  public async getUserInfo(@Req() request: Req, @Res() response: Res) {
    if (response.user.logged) {
      const a = await this.accountService.getAccountInfo(response.user.sub);
      response.status(200).json(a);
    } else {
      response.status(200).json({
        error: "Account doesn't authenticated",
      });
    }
  }

  @Post("/userinfo")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["account"], { failWithError: true }))
  public async postUserInfo(@Req() request: Req, @Res() response: Res) {
    if (response.user.logged) {
      const a = await this.accountService.getAccountInfo(response.user.sub);
      response.status(200).json(a);
    } else {
      response.status(200).json({
        error: "Account doesn't authenticated",
      });
    }
  }
}
