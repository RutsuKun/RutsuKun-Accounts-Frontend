import { IUsedAuthnMethod } from "@services/SessionService";
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
  uuid?: string;

  @Column({ type: "varchar" })
  session_id: string;

  @Column({ type: "date", nullable: true })
  session_issued: Date;

  @Column({ type: "date", nullable: true })
  session_expires: Date;

  @Column({ type: "varchar", nullable: true })
  idp: string;

  @Column({ type: "json" })
  amr: string[];

  @ManyToOne(() => AccountEntity, (account) => account.sessions)
  @JoinColumn({ name: "account_uuid", referencedColumnName: "uuid" })
  account: AccountEntity;
}
