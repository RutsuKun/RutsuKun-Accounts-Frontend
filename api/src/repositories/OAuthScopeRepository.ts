import { EntityRepository, Repository } from "typeorm";
import { OAuthScope } from "@entities/OAuthScope";

@EntityRepository(OAuthScope)
export class OAuthScopeRepository extends Repository<OAuthScope> {
  findAll(): Promise<OAuthScope[] | undefined> {
    return this.find();
  }
  findDefaultScopes(): Promise<OAuthScope[] | undefined> {
    return this.find({
        default: true
    })
  }
}
