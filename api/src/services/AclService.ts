import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";
import { AclRepository } from "@repositories/AclRepository";

@Injectable()
export class AclService {
  @Inject()
  @UseConnection("default")
  private aclRepository: AclRepository;

  public getAcls() {
    return this.aclRepository.find({
      relations: [
        "accounts",
        "accounts.scopes",
        "groups",
        "groups.scopes",
        "scopes",
      ],
    });
  }
}
