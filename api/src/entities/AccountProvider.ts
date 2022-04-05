import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account";

@Entity({
  name: "oauth_accounts_providers",
  engine: "InnoDB",
})
export class AccountProvider {
  constructor(provider: AccountProvider) {
    Object.assign(this, provider);
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid?: number;

  @Column({ type: "varchar" })
  provider: string;

  @Column({ type: "varchar" })
  id?: string;

  @Column({ type: "varchar" })
  name?: string;

  @Column({ type: "varchar" })
  email?: string;

  @Column({ type: "varchar" })
  picture?: string;

  @ManyToOne(() => AccountEntity, (account) => account.providers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  account?: AccountEntity;
}
