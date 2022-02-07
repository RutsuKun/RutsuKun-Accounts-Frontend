import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { AccountEntity } from "./Account";
  
  @Entity({
    name: "oauth_accounts_authn_methods",
    engine: "InnoDB",
  })
  export class AccountAuthnMethod {
    constructor(authn_method: AccountAuthnMethod) {
      Object.assign(this, authn_method);
    }
  
    @PrimaryGeneratedColumn()
    @Generated("uuid")
    uuid?: string;
  
    @Column({ type: "varchar" })
    type: string;

    @Column({ type: "json" })
    data: any;
  
    @Column({ type: "boolean" })
    enabled: boolean;
  
    @ManyToOne(() => AccountEntity, (account) => account.authn_methods, { onDelete: "CASCADE" })
    @JoinColumn({ name: "account_uuid", referencedColumnName: "uuid" })
    account?: AccountEntity;
  
  }
  