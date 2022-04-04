import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Get } from "@tsed/schema";
import { UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { GroupService } from "@services/GroupService";

@Controller("/admin/groups")
export class AdminGroupsRoute {
  constructor(@Inject() private groupService: GroupService) {}

  @Get()
  @UseBefore(AccessTokenMiddleware)
  @UseBefore(
    new ScopeMiddleware().use(["admin:groups:read", "admin:groups:manage", "admin:access"], {
      checkAllScopes: false,
    })
  )
  public async getIndex(req: Request, res: Response, next: NextFunction) {
    let groups = await this.groupService.getGroups();

    return res.status(200).json([
      ...groups.map((group) => {
        return {
          name: group.name,
          display_name: group.display_name,
          enabled: group.enabled,
          accounts: group.accounts.map((account) => {
            return {
              uuid: account.uuid,
              username: account.username,
              avatar: account.avatar,
            };
          }),
        };
      }),
    ]);
  }
}
