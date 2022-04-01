import { Inject, Injectable } from "@tsed/di";
import { UseConnection } from "@tsed/typeorm";
import { AclRepository } from "@repositories/AclRepository";
import { ClientEntity } from "@entities/Client";
import { CrossAclGroupScopeEntity } from "@entities/CrossAclGroupScope";
import { IAcl } from "common/interfaces/acl.interface";

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

  public async getAcl(client_id: string): Promise<IAcl> {
    const acl = await this.aclRepository.findOne({
      where: {
        client: {
          client_id,
        },
      },
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

    return {
      uuid: acl.uuid,
      client_id: acl.client.client_id,
      allowedScopes: acl.scopes.map((scope) => scope.name),
      allowedAccounts: this.getAccounts(acl.accountsWithScopes),
      allowedGroups: this.getGroups(acl.groupsWithScopes),
    };
  }

  public addAcl(client: ClientEntity) {
    return this.aclRepository.save({
      client,
    });
  }

  getAccounts(accountsWithScopes) {
    const accounts = [];

    accountsWithScopes.forEach(function (accountWithScope) {
      const foundAccount = accounts.find(
        (a) => a.uuid === accountWithScope.account.uuid
      );
      if (!foundAccount) {
        const newAccount = {
          uuid: accountWithScope.account.uuid,
          username: accountWithScope.account.username,
          picture: accountWithScope.account.avatar,
          allowedScopes: [accountWithScope.scope.name],
        };
        accounts.push(newAccount);
      } else {
        const index = accounts.findIndex((a) => a.uuid === foundAccount.uuid);
        accounts[index] = {
          ...accounts[index],
          allowedScopes: [
            ...accounts[index].allowedScopes,
            accountWithScope.scope.name,
          ],
        };
      }
    }, Object.create(null));

    return accounts;
  }

  getGroups(groupsWithScopes: CrossAclGroupScopeEntity[]) {
    const groups = [];

    groupsWithScopes.forEach(function (groupWithScope) {
      const foundGroup = groups.find(
        (g) => g.name === groupWithScope.group.name
      );
      if (!foundGroup) {
        groups.push({
          name: groupWithScope.group.name,
          enabled: groupWithScope.group.enabled,
          allowedScopes: [groupWithScope.scope.name],
        });
      } else {
        const index = groups.findIndex((a) => a.name === foundGroup.name);
        const newGroup = groups[index];
        if (groupWithScope.scope) {
          newGroup.allowedScopes.push(groupWithScope.scope.name);
        }
        groups[index] = newGroup;
      }
    }, Object.create(null));

    return groups;
  }
}
