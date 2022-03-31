import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account";
import { CrossAclGroupScopeEntity } from "./CrossAclGroupScope";

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

  @OneToMany((type: any) => CrossAclGroupScopeEntity, (groupScopes: CrossAclGroupScopeEntity) => groupScopes.group)
  groupScopes: CrossAclGroupScopeEntity[];
}
