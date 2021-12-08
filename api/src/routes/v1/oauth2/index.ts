import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Res,
  UseBefore,
} from "@tsed/common";
import { Request, Response } from "express";

import routes from "@routes";

// MIDDLEWARES

import { CheckClientMiddleware } from "@middlewares/client.middleware";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { SessionMiddleware } from "@middlewares/session.middleware";

// SERVICES

import { LoggerService } from "@services/LoggerService";
import { SessionService } from "@services/SessionService";
import { AccountsService } from "@services/AccountsService";
import { OAuth2Service } from "@services/OAuth2Service";
import { ClientService } from "@services/ClientService";
import { TokenService } from "@services/TokenService";

import { HTTPCodes } from "@utils";

@Controller("/oauth2")
export class OAuth2Route {
  public endpoints = routes.v1.endpoints.OAuth2RouteEndpoints;
  public logger: LoggerService;
  constructor(
    @Inject() private sessionService: SessionService,
    @Inject() private accountService: AccountsService,
    @Inject() private oauthService: OAuth2Service,
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService,
    @Inject() private tokenService: TokenService
  ) {
    this.logger = this.loggerService.child({
      label: { name: "OAuth2", type: "oauth2" },
    });
  }

  @Get()
  public getIndex(req: Request, res: Response) {
    return res.status(HTTPCodes.OK).json({
      message: "RutsuKun Accounts API - OAuth2 Endpoints",
    });
  }

  @Get("/authorize")
  public getAuthorize() {
    return this.endpoints.GET_AuthorizeRoute(
      this.oauthService,
      this.sessionService,
      this.clientService,
      this.logger
    );
  }

  @Post("/authorize")
  public postAuthorize() {
    return this.endpoints.POST_AuthorizeRoute(
      this.sessionService,
      this.oauthService,
      this.loggerService
    );
  }

  @Post("/token")
  @UseBefore(CheckClientMiddleware)
  public getToken() {
    return this.endpoints.POST_TokenRoute(
      this.logger,
      this.clientService,
      this.tokenService,
      this.accountService,
      this.oauthService
    );
  }

  @Post("/device")
  @UseBefore(CheckClientMiddleware)
  public postDevice() {
    return this.endpoints.POST_DeviceRoute(this.oauthService);
  }

  @Post("/token/revoke")
  @UseBefore(CheckClientMiddleware)
  public postTokenRevoke() {
    return this.endpoints.POST_TokenRevokeRoute(
      this.loggerService,
      this.oauthService,
      this.tokenService
    );
  }

  @Get("/userinfo")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["account"], { failWithError: true }))
  public getUserInfo() {
    return this.endpoints.GET_UserInfoRoute(this.accountService);
  }

  @Post("/userinfo")
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(new ScopeMiddleware().use(["account"], { failWithError: true }))
  public postUserInfo() {
    return this.endpoints.POST_UserInfoRoute(this.accountService);
  }

  @Get("/clients")
  @UseBefore(SessionMiddleware)
  public getClients() {
    return this.endpoints.GET_ClientsRoute(
      this.sessionService,
      this.clientService
    );
  }

  @Post("/clients")
  @UseBefore(SessionMiddleware)
  public postClients() {
    return this.endpoints.POST_ClientsRoute(
      this.sessionService,
      this.clientService,
      this.accountService
    );
  }

  @Delete("/clients/:clientId")
  @UseBefore(SessionMiddleware)
  public deleteClients() {
    return this.endpoints.DELETE_ClientsRoute(
      this.sessionService,
      this.clientService
      // this.accountService
    );
  }

  @Get("/clients/:clientId/public")
  public getClientsPublic() {
    return this.endpoints.GET_ClientsPublicRoute(this.clientService);
  }
}
