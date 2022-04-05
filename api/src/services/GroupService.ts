import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";
import { LoggerService } from "@services/LoggerService";
import { GroupRepository } from "@repositories/GroupRepository";
import { AccountGroup } from "@entities/AccountGroup";
import { DeleteResult } from "typeorm";

@Injectable()
export class GroupService {
  private running: boolean;
  private logger: LoggerService;

  @Inject()
  @UseConnection("default")
  private groupRepository: GroupRepository;

  constructor(private loggerService: LoggerService) {
    this.logger = this.loggerService.child({
      label: {
        type: "group",
        name: "Group Manager",
      },
    });
  }

  public getGroups() {
    return this.groupRepository.findAll();
  }

  public getGroupByUUID(uuid: string): Promise<AccountGroup> {
    return this.groupRepository.findOne({ uuid });
  }

  public getGroupPermissionsByUUID(uuid: string) {
    return this.groupRepository.findOne({
      where: { uuid },
      relations: ["groupScopes", "groupScopes.scope"],
    });
  }

  public getGroupMembersByUUID(uuid: string) {
    return this.groupRepository.findOne({
      where: { uuid },
      relations: ["accounts", "accounts.emails"],
    });
  }

  public createGroup(group: AccountGroup): Promise<AccountGroup> {
    return this.groupRepository.save(group);
  }

  public deleteGroup(uuid: string): Promise<DeleteResult> {
    return this.groupRepository.delete({ uuid });
  }
}