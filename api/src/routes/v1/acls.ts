import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Get } from "@tsed/schema";
import { UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { AclService } from "@services/AclService";

@Controller("/acls")
export class AclsRoute {
  constructor(@Inject() private aclService: AclService) {}

  @Get()
  // @UseBefore(AccessTokenMiddleware)
  // @UseBefore(
  //   new ScopeMiddleware().use(["acls:read", "acls:manage"], {
  //     checkAllScopes: false,
  //   })
  // )
  public async getIndex(req: Request, res: Response, next: NextFunction) {
    let acls = await this.aclService.getAcls();

    return res.status(200).json([
      ...acls.map((acl) => {
        return {
          uuid: acl.uuid,
          client_id: acl.client.client_id,
          allowedScopes: acl.scopes.map((scope) => scope.name),
          allowedAccounts: acl.accounts.map((account) => {
            return {
              uuid: account.uuid,
              username: account.username,
              avatar: account.avatar,
              allowedScopes: account.scopes.map((scope) => scope.name),
            };
          }),
          allowedGroups: acl.groups.map((group) => {
            return {
              name: group.name,
              enabled: group.enabled,
              allowedScopes: group.scopes.map((scope) => scope.name)
            };
          }),
        };
      }),
    ]);
  }
}
