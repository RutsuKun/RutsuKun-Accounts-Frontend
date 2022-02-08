import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";
import { LoggerService } from "@services/LoggerService";
import { GroupRepository } from "@repositories/GroupRepository";

@Injectable()
export class GroupService {
  private running: boolean;
  private logger: LoggerService;

  @Inject()
  @UseConnection("default")
  private groupRepository: GroupRepository;

  constructor(
    private loggerService: LoggerService
  ) {
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
}