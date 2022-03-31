import {
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ClientEntity } from "./Client";
import { CrossAclAccountScopeEntity } from "./CrossAclAccountScope";
import { CrossAclGroupScopeEntity } from "./CrossAclGroupScope";
import { OAuthScope } from "./OAuthScope";

@Entity({
  name: "oauth_clients_acls",
  engine: "InnoDB",
})
export class OAuthClientACL {
  constructor(acl?: OAuthClientACL) {
    if (acl) {
      Object.assign(this, acl);
    }
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid?: string;

  @OneToOne(() => ClientEntity, (client) => client.acl, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "client_id",
    referencedColumnName: "client_id",
  })
  client?: ClientEntity;

  @ManyToMany(() => OAuthScope, (scope) => scope.acls)
  @JoinTable({
    name: "oauth_clients_acls_scopes",
    joinColumn: {
      name: "acl_uuid",
      referencedColumnName: "uuid",
    },
    inverseJoinColumn: {
      name: "scope_name",
      referencedColumnName: "name",
    },
  })
  scopes?: OAuthScope[];

  @OneToMany(
    () => CrossAclAccountScopeEntity,
    (accountScope: CrossAclAccountScopeEntity) => accountScope.acl
  )
  accountsWithScopes: CrossAclAccountScopeEntity[];

  @OneToMany(
    () => CrossAclGroupScopeEntity,
    (groupScope: CrossAclGroupScopeEntity) => groupScope.acl
  )
  groupsWithScopes: CrossAclGroupScopeEntity[];
}
