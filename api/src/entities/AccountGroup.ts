import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account";
import { OAuthClientACL } from "./OAuthClientACL";
import { OAuthScope } from "./OAuthScope";

@Entity({
  name: "oauth_accounts_groups",
  engine: "InnoDB",
})
export class AccountGroup {
  constructor(group: AccountGroup) {
    Object.assign(this, group);
  }

  @Column({ type: "varchar" })
  @PrimaryColumn()
  name: string;

  @Column({ type: "varchar" })
  display_name: string;

  @Column({ type: "boolean" })
  enabled: boolean;

  @ManyToMany(() => AccountEntity, (account)=> account.groups)
  accounts?: AccountEntity[];

  @ManyToMany(() => OAuthClientACL, (acl) => acl.groups, { cascade: true })
  acl?: OAuthClientACL[];

  @ManyToMany(() => OAuthScope, (scope) => scope.groups)
  @JoinTable({
    name: 'GroupToScope',
    joinColumn: {
      name: 'group_name',
      referencedColumnName: 'name'
    },
    inverseJoinColumn: {
      name: 'scope_name',
      referencedColumnName: 'name'
    }
  })
  scopes?: OAuthScope[];
}
