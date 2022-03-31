import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { AccountEntity } from "./Account";
import { OAuthClientACL } from "./OAuthClientACL";
import { OAuthClientOrganization } from "./OAuthClientOrganization";
import { OAuthScope } from "./OAuthScope";

@Entity({
  name: "oauth_clients",
  engine: "InnoDB",
})
export class ClientEntity {
  constructor(client: ClientEntity) {
    Object.assign(this, client);
  }

  @Generated("uuid")
  uuid?: string;

  @Column({ type: "varchar", default: "ACTIVE" })
  state?: string;

  @Column({ type: "varchar" })
  @PrimaryColumn()
  client_id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  third_party?: string;

  @Column({ type: "varchar", nullable: true })
  website?: string;

  @Column({ type: "varchar", nullable: true })
  secret?: string;

  @Column({ type: "varchar", default: "/assets/images/logo/app-default-logo.png" })
  logo?: string;

  @Column({ type: "varchar", nullable: true })
  privacy_policy?: string;

  @Column({ type: "varchar", nullable: true })
  tos?: string;

  @Column({ type: "json" })
  redirect_uris: string[];

  @Column({ type: "json" })
  response_types: string[];

  @Column({ type: "json" })
  grant_types: string[];

  @Column({ type: "varchar", default: 'hybrid' })
  type: string;

  @Column({ type: "boolean" })
  consent: boolean;

  @Column({ type: "boolean", default: false })
  verified?: string;

  @ManyToOne(() => AccountEntity, (account) => account.clients)
  @JoinColumn({ name: "account_uuid", referencedColumnName: "uuid" })
  account?: AccountEntity;

  @OneToOne(() => OAuthClientACL, (acl) => acl.client, { cascade: true  })
  acl?: OAuthClientACL;

  @OneToOne(() => OAuthClientOrganization, (org) => org.client, { cascade: true  })
  organization?: OAuthClientOrganization;

  addAcl?(scopes: OAuthScope[]) {
    // this.acl = {
    //   client: this,
    //   scopes: scopes
    // };
  }

}
