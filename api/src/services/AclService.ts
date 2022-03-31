import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";
import { AclRepository } from "@repositories/AclRepository";
import { ClientEntity } from "@entities/Client";

@Injectable()
export class AclService {
  @Inject()
  @UseConnection("default")
  private aclRepository: AclRepository;

  public getAcls() {
    return this.aclRepository.find({
      relations: [
        "client",
        "scopes",
        "accountsWithScopes",
        "accountsWithScopes.scope",
        "accountsWithScopes.account",
        "groupsWithScopes",
        "groupsWithScopes.group",
        "groupsWithScopes.scope",
      ],
    });
  }

  public getAcl(client_id: string) {
    return this.aclRepository.findOne({
      where: {
        client: {
          client_id
        }
      },
      relations: ["scopes", "accounts", "groups"]
    })
  }

  public addAcl(client: ClientEntity) {
    return this.aclRepository.save({
      client
    })
  }
}
