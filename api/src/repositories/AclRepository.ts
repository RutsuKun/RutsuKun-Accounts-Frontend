import { EntityRepository, Repository } from "typeorm";
import { OAuthClientACL } from "@entities/OAuthClientACL";

@EntityRepository(OAuthClientACL)
export class AclRepository extends Repository<OAuthClientACL> {
  findAll(): Promise<OAuthClientACL[] | undefined> {
    return this.find({
      relations: ["accounts"],
    });
  }
}
