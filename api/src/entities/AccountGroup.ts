import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./Account";

@Entity({
  name: "oauth_accounts_groups",
  engine: "InnoDB",
})
export class AccountGroup {
  constructor(group: AccountGroup) {
    Object.assign(this, group);
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Generated("uuid")
  uuid?: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  display_name: string;

  @Column({ type: "boolean" })
  enabled: boolean;

  @ManyToMany(() => AccountEntity, (account)=> account.groups)
  account: AccountEntity; 
}
