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

  @Column({ type: "boolean", default: false })
  default: boolean;

  @Column({ type: "boolean", default: false })
  system: boolean;
    
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => OAuthClientACL, (acl) => acl.scopes, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  acls?: CrossAclAccountScopeEntity[];

  @OneToMany(() => CrossAclAccountScopeEntity, (accountScope) => accountScope.account)
  scopesAccounts?: CrossAclAccountScopeEntity[];

  @OneToMany(() => CrossAclGroupScopeEntity, (groupScope) => groupScope.group)
  scopesGroups?: CrossAclAccountScopeEntity[];
}
  