import { EntityRepository, Repository } from "typeorm";
import { OAuthRevokedToken } from "@entities/OAuthRevokedToken";
import { OAuthDeviceCode } from "@entities/OAuthDeviceCode";

@EntityRepository(OAuthRevokedToken)
export class OAuthRevokedTokenRepository extends Repository<OAuthRevokedToken> {
  getOneByJTI(jti: string): Promise<OAuthRevokedToken | undefined> {
    return this.findOne({ jti });
  }
  saveRevokedToken(
    item: OAuthRevokedToken
  ): Promise<OAuthRevokedToken | undefined> {
    return this.save(item);
  }
}

@EntityRepository(OAuthDeviceCode)
export class OAuthDeviceCodeRepository extends Repository<OAuthDeviceCode> {
  getOneByClientID(
    client_id: string
  ): Promise<OAuthDeviceCode | undefined> {
    return this.findOne({ client_id });
  }
}
