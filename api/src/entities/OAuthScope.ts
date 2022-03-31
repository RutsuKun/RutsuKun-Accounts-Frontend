import {
    Column,
    Entity,
    Generated,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
  } from "typeorm";
import { CrossAclAccountScopeEntity } from "./CrossAclAccountScope";
import { CrossAclGroupScopeEntity } from "./CrossAclGroupScope";
import { OAuthClientACL } from "./OAuthClientACL";
  
@Entity({
  name: "oauth_scopes",
  engine: "InnoDB",
})
export class OAuthScope {
  constructor(scope: OAuthScope) {
    Object.assign(this, scope);
  }

  @Generated("uuid")
  @Column()
  uuid?: string;

  @Column({ type: "boolean" })
  default: boolean;

  @PrimaryColumn()
  name: string;

  @ManyToMany(() => OAuthClientACL, (acl) => acl.scopes)
  acls?: CrossAclAccountScopeEntity[];

  @OneToMany(() => CrossAclAccountScopeEntity, (accountScope) => accountScope.account)
  scopesAccounts?: CrossAclAccountScopeEntity[];

  @OneToMany(() => CrossAclGroupScopeEntity, (groupScope) => groupScope.group)
  scopesGroups?: CrossAclAccountScopeEntity[];
}
  