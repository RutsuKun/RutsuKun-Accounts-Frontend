import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  VersionColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { ClientEntity } from "./Client";
import { Email } from "./Email";
import { AccountProvider } from "./AccountProvider";
import { AccountGroup } from "./AccountGroup";
import { AccountAuthnMethod } from "./AccountAuthnMethod";
import { AccountSession } from "./AccountSession";
import { CrossAclAccountScopeEntity } from "./CrossAclAccountScope";

@Entity({
  name: "oauth_accounts",
  engine: "InnoDB",
})
export class AccountEntity {
  constructor(account: AccountEntity) {
    Object.assign(this, account);
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid?: string;

  @Column({ type: "varchar" })
  username?: string;

  @Column({ type: "varchar", nullable: true, default: null })
  password?: string;

  @Column({
    type: "varchar",
    default: "/assets/images/avatars/default-avatar.png",
  })
  avatar?: string;

  @Column({ type: "varchar", default: "user" })
  role?: string;

  @Column({ type: "boolean", default: false })
  banned?: boolean;

  @Column({ type: "varchar", nullable: true, default: null })
  secret2fa?: string;

  @Column({ type: "boolean", default: false })
  enabled2fa?: boolean;

  @Column({ type: "varchar", nullable: true, default: "ENABLED" })
  state?: string;

  @OneToMany(() => AccountProvider, (provider) => provider.account, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  providers?: AccountProvider[];

  @OneToMany(() => ClientEntity, (client) => client.account, { cascade: true })
  clients?: ClientEntity[];

  @OneToMany(() => Email, (email) => email.account, { cascade: true })
  emails?: Email[];

  @ManyToMany(() => AccountGroup, (group) => group.accounts, { cascade: true })
  @JoinTable({
    name: "AccountToGroup",
    joinColumn: {
      name: "account_uuid",
      referencedColumnName: "uuid",
    },
    inverseJoinColumn: {
      name: "group_name",
      referencedColumnName: "name",
    },
  })
  groups?: AccountGroup[];

  @OneToMany(() => AccountSession, (session) => session.account, { cascade: true })
  sessions?: AccountSession[];

  @OneToMany(() => CrossAclAccountScopeEntity, (scope) => scope.account)
  accountScopes?: CrossAclAccountScopeEntity[];

  @OneToMany(() => AccountAuthnMethod, (authn) => authn.account, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  authn_methods?: AccountAuthnMethod[];

  @VersionColumn()
  version?: number;

  verifyPassword?(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  isPrimaryEmailVerified?(): boolean {
    return this.emails.find((email) => email.primary).email_verified;
  }

  getPrimaryEmail?(): string {
    return this.emails.find((email) => email.primary).email;
  }

  addClient?(client: ClientEntity) {
    if (this.clients == null) {
      this.clients = Array<ClientEntity>();
    }
    this.clients.push(client);
  }

  addEmail?(email: Email) {
    if (this.emails == null) {
      this.emails = Array<Email>();
    }
    this.emails.push(email);
  }

  addProvider?(provider: AccountProvider) {
    if (this.providers == null) {
      this.providers = Array<AccountProvider>();
    }
    this.providers.push(provider);
  }

  removeProvider?(providerType: string) {
    this.providers = this.providers.filter(
      (provider) => provider.provider !== providerType
    );
  }
}
