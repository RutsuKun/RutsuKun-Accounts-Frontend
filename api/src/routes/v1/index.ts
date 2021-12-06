import { Request, Response } from "express";
import { Config } from "@config";

// AUTH ROUTES
import { POST_AuthIndexRoute } from "./auth";
import {
  GET_AuthSessionRoute,
  GET_AuthSessionEndRoute,
  POST_AuthSessionEndRoute,
  GET_AuthSessionDetailsRoute,
} from "./auth/session";
import { POST_SignInRoute } from "./auth/signin";
import { POST_SignUpRoute } from "./auth/signup";
import { POST_ReAuthRoute } from "./auth/reauth";

// OAUTH2 ROUTES
import { GET_AuthorizeRoute, POST_AuthorizeRoute } from "./oauth2/authorize";
import { POST_TokenRoute } from "./oauth2/token";
import { POST_TokenRevokeRoute } from "./oauth2/token_revoke";
import { POST_TokenInfoRoute } from "./oauth2/tokeninfo";
import { GET_UserInfoRoute, POST_UserInfoRoute } from "./oauth2/userinfo";

import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { DELETE_ClientsRoute, GET_ClientsRoute, POST_ClientsRoute } from "./oauth2/clients";
import { POST_AuthDeviceRoute } from "./auth/device";
import { POST_DeviceRoute } from "./oauth2/device";
import {
  GET_AuthProviderCallbackRoute,
  GET_AuthProviderDisconnectRoute,
  GET_AuthProviderRoute,
} from "./auth/providers";
import {
  DELETE_AccountsMeEmailRoute,
  GET_AccountsMeRoute,
  POST_AccountsMeEmailRoute,
} from "./accounts/me";

@Controller("/")
export class IndexRoute {
  constructor() {}

  @Get()
  public getIndex(req: Request, res: Response) {
    return res.status(200).json({
      service: Config.appInfo.name,
      version: "v1",
      environment: Config.Environment.NODE_ENV,
    });
  }
}

const RouteV1Endpoints = {
  OAuth2RouteEndpoints: {
    GET_AuthorizeRoute,
    POST_AuthorizeRoute,
    POST_TokenRoute,
    POST_TokenRevokeRoute,
    POST_TokenInfoRoute,
    GET_UserInfoRoute,
    POST_UserInfoRoute,
    GET_ClientsRoute,
    POST_ClientsRoute,
    DELETE_ClientsRoute,
    POST_DeviceRoute,
  },
  AuthRoutesEndpoints: {
    POST_AuthIndexRoute,
    POST_SignInRoute,
    POST_SignUpRoute,
    POST_ReAuthRoute,
    GET_AuthSessionRoute,
    GET_AuthSessionDetailsRoute,
    GET_AuthSessionEndRoute,
    POST_AuthSessionEndRoute,
    POST_AuthDeviceRoute,
    GET_AuthProviderRoute,
    GET_AuthProviderCallbackRoute,
    GET_AuthProviderDisconnectRoute,
  },
  AccountsRouteEndpoints: {
    GET_AccountsMeRoute,
    POST_AccountsMeEmailRoute,
    DELETE_AccountsMeEmailRoute,
  },
};

export { RouteV1Endpoints };
