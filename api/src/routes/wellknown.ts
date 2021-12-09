import { Controller, Get, Req, Res } from "@tsed/common";
import * as jose from "jose";
import { Config } from "@config";
import { createPublicKey, createPrivateKey } from "crypto";
import keys from "@config/keys";

@Controller(".well-known")
export class WellKnownRoute {
  @Get("/oauth-authorization-server")
  public getOAuth2AuthorizationServerSpecs(@Req() request: Req, @Res() response: Res) {
    return response.status(200).json({
      issuer: Config.OAUTH2.issuer,
      authorization_endpoint: Config.OAUTH2.authorization_endpoint,
      registration_endpoint: Config.OAUTH2.registration_endpoint,
      token_endpoint: Config.OAUTH2.token_endpoint,
      userinfo_endpoint: Config.OAUTH2.userinfo_endpoint,
      end_session_endpoint: Config.OpenID.end_session_endpoint,
      revocation_endpoint: Config.OAUTH2.revocation_endpoint,
      introspection_endpoint: Config.OAUTH2.introspection_endpoint,
      jwks_uri: Config.OAUTH2.jwks_uri,
      scopes_supported: Config.OAUTH2.scopes_supported,
      response_types_supported: Config.OAUTH2.response_types_supported,
      response_modes_supported: Config.OAUTH2.response_modes_supported,
      grant_types_supported: Config.OAUTH2.grant_types_supported,
      token_endpoint_auth_methods_supported: Config.OAUTH2.token_endpoint_auth_methods_supported,
      code_challenge_methods_supported: Config.OAUTH2.code_challenge_methods_supported,
      service_documentation: Config.OAUTH2.service_documentation,
      ui_locales_supported: Config.OAUTH2.ui_locales_supported,
      op_policy_uri: Config.OAUTH2.op_policy_uri,
      op_tos_uri: Config.OAUTH2.op_tos_uri,
    });
  }

  @Get("/openid-configuration")
  public async getOpenIDConfigurationSpecs(@Req() request: Req, @Res() response: Res) {
    // CLIENT REGISTRATION https://tools.ietf.org/html/rfc7591
    return response.status(200).json({
      issuer: Config.OAUTH2.issuer,
      authorization_endpoint: Config.OAUTH2.authorization_endpoint,
      registration_endpoint: Config.OAUTH2.registration_endpoint,
      token_endpoint: Config.OAUTH2.token_endpoint,
      userinfo_endpoint: Config.OAUTH2.userinfo_endpoint,
      end_session_endpoint: Config.OpenID.end_session_endpoint,
      revocation_endpoint: Config.OAUTH2.revocation_endpoint,
      introspection_endpoint: Config.OAUTH2.introspection_endpoint,
      jwks_uri: Config.OAUTH2.jwks_uri,
      scopes_supported: Config.OAUTH2.scopes_supported,
      claims_parameter_supported: Config.OpenID.claims_parameter_supported,
      claims_supported: Config.OpenID.claims_supported,
      response_types_supported: Config.OAUTH2.response_types_supported,
      response_modes_supported: Config.OAUTH2.response_modes_supported,
      id_token_signing_alg_values_supported: Config.OpenID.id_token_signing_alg_values_supported,
      grant_types_supported: Config.OAUTH2.grant_types_supported,
      token_endpoint_auth_methods_supported: Config.OAUTH2.token_endpoint_auth_methods_supported,
      code_challenge_methods_supported: Config.OAUTH2.code_challenge_methods_supported,
      subject_types_supported: Config.OpenID.subject_types_supported,
      service_documentation: Config.OAUTH2.service_documentation,
      ui_locales_supported: Config.OAUTH2.ui_locales_supported,
      op_policy_uri: Config.OAUTH2.op_policy_uri,
      op_tos_uri: Config.OAUTH2.op_tos_uri,
    });
  }

  @Get("/jwks.json")
  public async getJwks(@Req() request: Req, @Res() response: Res) {
    const publicKey = createPublicKey(keys.idTokenPublicKey());
    // @ts-ignore
    const storeKey = jose.JWK.asKey(publicKey);
    const keystore = new jose.JWKS.KeyStore([storeKey]);
    return response.status(200).json(keystore.toJWKS());
  }
}
