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
  name: "oauth_accounts_emails",
  engine: "InnoDB",
})
export class Email {
  constructor(email: Email) {
    Object.assign(this, email);
  }

  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  @Generated("uuid")
  uuid?: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "boolean" })
  email_verified: boolean;

  @Column({ type: "boolean" })
  primary: boolean;

  @ManyToOne(() => AccountEntity, (account) => account.emails)
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  account?: AccountEntity;
}
