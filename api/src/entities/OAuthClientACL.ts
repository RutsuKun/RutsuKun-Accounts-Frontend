import {
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account";
import { AccountGroup } from "./AccountGroup";
import { ClientEntity } from "./Client";
import { OAuthScope } from "./OAuthScope";

@Entity({
  name: "oauth_clients_acls",
  engine: "InnoDB",
})
export class OAuthClientACL {
  constructor(acl: OAuthClientACL) {
    Object.assign(this, acl);
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid?: string;

  @OneToOne(() => ClientEntity, (client) => client.acl)
  @JoinColumn({
    name: "client_id",
    referencedColumnName: "client_id",
  })
  client?: ClientEntity[];

  @ManyToMany(() => AccountGroup, (group) => group.acl)
  @JoinTable({
    name: 'AclToGroup',
    joinColumn: {
      name: 'acl_uuid',
      referencedColumnName: 'uuid'
    },
    inverseJoinColumn: {
      name: 'group_name',
      referencedColumnName: 'name'
    }
  })
  groups?: AccountGroup[];

  @ManyToMany(() => AccountEntity, (account) => account.acl)
  @JoinTable({
    name: 'AclToAccount',
    joinColumn: {
      name: 'acl_uuid',
      referencedColumnName: 'uuid'
    },
    inverseJoinColumn: {
      name: 'account_uuid',
      referencedColumnName: 'uuid'
    }
  })
  accounts?: AccountEntity[];

  @ManyToMany(() => OAuthScope, (scope) => scope.acls)
  @JoinTable({
    name: 'AclToScope',
    joinColumn: {
      name: 'acl_uuid',
      referencedColumnName: 'uuid'
    },
    inverseJoinColumn: {
      name: 'scope_name',
      referencedColumnName: 'name'
    }
  })
  scopes?: OAuthScope[];
}
