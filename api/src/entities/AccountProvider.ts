import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./Account";

@Entity({
  name: "oauth_accounts_providers",
  engine: "MyISAM",
})
export class AccountProvider {
  constructor(provider: AccountProvider) {
    Object.assign(this, provider);
  }

  @PrimaryColumn()
  @Generated("uuid")
  private uuid?: number;

  @Column({
    type: "varchar",
  })
  provider: string;

  @Column({
    type: "varchar",
  })
  id?: string;

  @Column({
    type: "varchar",
  })
  name?: string;

  @Column({
    type: "varchar",
  })
  email?: string;

  @Column({
    type: "varchar",
  })
  picture?: string;

  @ManyToOne(() => AccountEntity, (account) => account.emails, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "account_uuid",
    referencedColumnName: "uuid",
  })
  account: AccountEntity;
}
