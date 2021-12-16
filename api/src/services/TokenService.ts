import { encode } from "@blakeembrey/base64url";
import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";

import { TokenCheck } from "@middlewares/security";

import { OAuthRevokedTokenRepository } from "@repositories/OAuthRepository";
import { OAuthRevokedToken } from "@entities/OAuthRevokedToken";

import { LoggerService } from "@services/LoggerService";

import { Config } from "@config";

import * as jose from "jose";
import { createHash } from "crypto";
import { Req, Res } from "@tsed/common";


@Injectable()
export class TokenService {
  private running: boolean;

  @Inject()
  @UseConnection("default")
  private revokedTokenRepository: OAuthRevokedTokenRepository;

  constructor(private logger: LoggerService) {
    this.logger = this.logger.child({
      label: {
        type: "token",
        name: "Token Manager",
      },
    });
  }

  public healthy() {
    const ctx = this;
    const healthy = {
      name: "Token",
      slug: "token",
      healthy: ctx.running,
    };
    return healthy;
  }

  public checkToken(req: Req, res: Res): Promise<any> {
    return new Promise((resolve, reject) => {
      TokenCheck(req, res)
        .then((user) => {
          resolve(user);
        })
        .catch(reject);
    });
  }

  public toAlgorithm(alg: string) {
    if (alg.endsWith("512")) return "sha512";
    if (alg.endsWith("384")) return "sha384";
    if (alg.endsWith("256")) return "sha256";

    throw new TypeError(`Unknown algorithm: ${alg}`);
  }

  public createAtHash(accessToken, alg): string {
    const hash = createHash(this.toAlgorithm(alg)).update(accessToken).digest();

    return encode(hash.slice(0, hash.length / 2));
  }

  public createCHash(code, alg): string {
    const hash = createHash(this.toAlgorithm(alg)).update(code).digest();

    return encode(hash.slice(0, hash.length / 2));
  }

  public createSHash(state, alg): string {
    const hash = createHash(this.toAlgorithm(alg)).update(state).digest();
    return encode(hash.slice(0, hash.length / 2));
  }

  public async createCodeToken(data: CodeData): Promise<string> {
    const code_token = jose.JWT.sign(
      {
        iss: Config.OAUTH2.issuer,
        sub: data.sub,
        scp: data.scopes,
        aud: Config.API.url,
        cid: data.client_id,
        code_challenge: data.code_challenge,
        code_challenge_method: data.code_challenge_method,
        state: data.state,
        nonce: data.nonce,
        type: "code",
        timestamp: Date.now(),
      },
      Config.Token.CodeTokenPrivateKey,
      {
        algorithm: "RS256",
        expiresIn: "2m",
      }
    );
    return code_token;
  }

  public async verifyCodeToken(token: string) {
    try {
      const verify = await jose.JWT.verify(
        token,
        Config.Token.CodeTokenPublicKey,
        {
          issuer: Config.OAUTH2.issuer, //who signed the token
        }
      );
      return verify;
    } catch (err) {
      return false;
    }
  }

  public async createIDToken(data: IDTokenData): Promise<string> {
    const ctx = this;
    return new Promise((resolve, reject) => {
      const auth_time = Math.floor(Date.now() / 1000);

      const id_token = jose.JWT.sign(
        {
          iss: Config.OAUTH2.issuer,
          sub: data.sub,
          aud: data.client_id,
          amr: data.amr,
          acr: data.acr,
          azp: data.client_id,
          auth_time: auth_time,
          username: data.username,
          picture: `${Config.CDN.url}/${data.sub}`,
          role: data.role,
          banned: data.banned,
          scp: data.scopes,
          country: data.country,
          locale: data.locale,
          jti: data.jti, // id token unique id
          at_hash: data.at_hash, //access token hash
          c_hash: data.c_hash, // code hash
          s_hash: data.s_hash, // state hash
          nonce: data.nonce,
          type: "id_token",
        },
        Config.Token.IDTokenPrivateKey,
        {
          algorithm: "RS256",
          expiresIn: "31d",
        }
      );
      resolve(id_token);
    });
  }

  public createAccessToken(data: CreateAccessTokenData): Promise<string> {
    return new Promise((resolve, reject) => {
      const access_token = jose.JWT.sign(
        {
          iss: Config.OAUTH2.issuer,
          sub: data.sub,
          aud: data.client_id,
          scp: data.scopes,
          jti: data.jti, // access token unique id
          timestamp: Date.now(),
          type: "access_token",
        },
        Config.Token.AccessTokenPrivateKey,
        {
          algorithm: "RS256",
          expiresIn: `${Config.Token.AccessTokenExp.toString()}s`,
        }
      );
      resolve(access_token);
    });
  }

  public verifyAccessToken(token: string) {
    const verify = jose.JWT.verify(token, Config.Token.AccessTokenPublicKey, {
      issuer: Config.OAUTH2.issuer, //who signed the token
    });
    return verify;
  }

  public async checkAccessTokenIsRevoked(jti: string) {
    const check = await this.revokedTokenRepository.getOneByJTI(jti);
    return !!check;
  }

  public revokeAccessToken(item: OAuthRevokedToken) {
    return this.revokedTokenRepository.saveRevokedToken(item);
  }

  public generateEmailCode(accountId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const email_code_token = jose.JWT.sign(
        {
          sub: accountId,
          type: "email_code",
        },
        Config.Token.EmailCodePrivateKey,
        {
          algorithm: "RS256",
          expiresIn: "30m",
        }
      );
      resolve(email_code_token);
    });
  }

  public verifyEmailCode(token: string) {
    const verify = jose.JWT.verify(token, Config.Token.EmailCodePublicKey);
    return verify;
  }
}

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

export interface AuthTokenData {
  sub: string;
}

export interface CodeData {
  sub: string;
  client_id: string;
  scopes?: Array<string>;
  code_challenge?: string;
  code_challenge_method?: string;
  state?: string;
  nonce?: string;
}

export interface CreateAccessTokenData {
  iss?: string;
  sub: string;
  client_id: string;
  scopes: Array<string>;
  jti?: string;
}

export interface AccessTokenData {
  iss: string;
  sub: string;
  aud: string;
  scp: Array<string>;
  jti: string;
  timestamp: number;
  iat: number;
  exp: number;
}

export interface IDTokenData {
  sub: string;
  username: string;
  picture: string;
  email: string;
  role: string;
  banned: boolean;
  client_id: string;
  country?: string;
  scopes?: Array<string>;
  amr?: Array<string>;
  acr?: string;
  azp?: Array<string>;
  locale?: string;
  jti?: string;
  at_hash?: string;
  c_hash?: string;
  s_hash?: string;
  nonce?: string;
}
