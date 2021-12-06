import { EntityRepository, Repository } from "typeorm";
import {
  OAuthDeviceCodeEntity,
  OAuthRevokedTokenEntity,
} from "../entities/OAuth";

@EntityRepository(OAuthRevokedTokenEntity)
export class OAuthRevokedTokenRepository extends Repository<OAuthRevokedTokenEntity> {
  getOneByJTI(jti: string): Promise<OAuthRevokedTokenEntity | undefined> {
    return this.findOne({ jti });
  }
  saveRevokedToken(
    item: OAuthRevokedTokenEntity
  ): Promise<OAuthRevokedTokenEntity | undefined> {
    return this.save(item);
  }
}

@EntityRepository(OAuthDeviceCodeEntity)
export class OAuthDeviceCodeRepository extends Repository<OAuthDeviceCodeEntity> {
  getOneByClientID(
    client_id: string
  ): Promise<OAuthDeviceCodeEntity | undefined> {
    return this.findOne({ client_id });
  }
}
