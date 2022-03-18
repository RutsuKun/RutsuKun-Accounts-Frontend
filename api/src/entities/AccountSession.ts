import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AccountEntity } from "./Account";

@Entity({
  name: "oauth_accounts_sessions",
  engine: "InnoDB",
})
export class AccountSession {
  constructor(session: AccountSession) {
    Object.assign(this, session);
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid: string;

  @Column({ type: "varchar" })
  session_state: string;

  @Column({ type: "boolean" })
  revoked: boolean;

  @ManyToOne(() => AccountEntity, (account) => account.sessions)
  @JoinColumn({ name: "account_uuid", referencedColumnName: "uuid" })
  account_uuid: string;
}
