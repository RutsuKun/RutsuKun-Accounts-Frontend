import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { AccountEntity } from "./Account";

@Entity({
  name: "oauth_accounts_emails",
  engine: "MyISAM",
})
export class Email {
  constructor(email: Email) {
    Object.assign(this, email);
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "varchar",
  })
  email: string;

  @Column({
    type: "boolean",
  })
  email_verified: boolean;

  @Column({
    type: "boolean",
  })
  primary: boolean;

  @ManyToOne(() => AccountEntity, (account) => account.emails)
  @JoinColumn({
    name: "account_uuid",
    referencedColumnName: "uuid",
  })
  account: AccountEntity;

  @RelationId((email: Email) => email.account)
  @Column()
  account_uuid?: string;
}
