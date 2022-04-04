import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountGroup } from "./AccountGroup";
import { OAuthClientACL } from "./OAuthClientACL";
import { OAuthScope } from "./OAuthScope";

@Entity({
  name: "oauth_clients_acls_groups_scopes",
  engine: "InnoDB",
})
export class CrossAclGroupScopeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => AccountGroup, (group: AccountGroup) => group.groupScopes)
  group: AccountGroup;

  @ManyToOne(() => OAuthScope, (scope: OAuthScope) => scope.name, { cascade: true })
  scope: OAuthScope;

  @ManyToOne(() => OAuthClientACL, (acl: OAuthClientACL) => acl.groupsWithScopes)
  acl: OAuthClientACL;

}
