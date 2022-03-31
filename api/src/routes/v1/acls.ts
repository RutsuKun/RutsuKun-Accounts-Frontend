import { NextFunction, Request, Response } from "express";
import { Controller, Inject } from "@tsed/di";
import { Get } from "@tsed/schema";
import { UseBefore } from "@tsed/common";
import { AccessTokenMiddleware } from "@middlewares/security";
import { ScopeMiddleware } from "@middlewares/scope.middleware";
import { AclService } from "@services/AclService";
import { CrossAclGroupScopeEntity } from "@entities/CrossAclGroupScope";

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
          allowedAccounts: this.getAccounts(acl.accountsWithScopes),
          allowedGroups: this.getGroups(acl.groupsWithScopes)
        };
      }),
    ]);
  }

  getAccounts(accountsWithScopes) {

    const accounts = [];

    accountsWithScopes.forEach(function (accountWithScope) {

      const foundAccount = accounts.find((a) => a.uuid === accountWithScope.account.uuid);
      if (!foundAccount) {
        const newAccount = {
          uuid: accountWithScope.account.uuid,
          username: accountWithScope.account.username,
          picture: accountWithScope.account.avatar,
          allowedScopes: [accountWithScope.scope.name],
        };
        accounts.push(newAccount);
      } else {
        const index = accounts.findIndex((a)=>a.uuid === foundAccount.uuid);
        accounts[index] = {
          ...accounts[index],
          allowedScopes: [...accounts[index].allowedScopes, accountWithScope.scope.name],
        };
      }

    }, Object.create(null));

    return accounts;

  }

  getGroups(groupsWithScopes: CrossAclGroupScopeEntity[]) {

    const groups = [];

    groupsWithScopes.forEach(function (groupWithScope) {

      const foundGroup = groups.find((g) => g.name === groupWithScope.group.name);
      if (!foundGroup) {
        groups.push({
          name: groupWithScope.group.name,
          enabled: groupWithScope.group.enabled,
          allowedScopes: [groupWithScope.scope.name],
        });
      } else {
        const index = groups.findIndex((a) => a.name === foundGroup.name);
        groups[index] = {
          ...groups[index],
          allowedScopes: [
            ...groups[index].allowedScopes,
            groupWithScope.scope.name,
          ],
        };
      }

    }, Object.create(null));

    return groups;

  }
}
