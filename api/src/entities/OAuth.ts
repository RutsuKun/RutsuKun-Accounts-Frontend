import { Config } from "@config";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./Account";
import { ClientEntity } from "./Client";

@Entity({
  name: "oauth_revoked_tokens",
  engine: "MyISAM",
})
export class OAuthRevokedTokenEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "uuid",
  })
  @Generated("uuid")
  uuid?: string;

  @Column({
    type: "varchar",
  })
  type: "access_token" | "refresh_token";

  @Column({
    type: "varchar",
  })
  jti: string;

  @Column({
    type: "numeric",
  })
  exp: number;

  @OneToOne((type) => AccountEntity, (account) => account.uuid, {
    cascade: true,
  })
  @JoinColumn({ name: "sub", referencedColumnName: "uuid" })
  sub: string;

  @OneToOne((type) => ClientEntity, (client) => client.client_id, {
    cascade: true,
  })
  @JoinColumn({ name: "aud", referencedColumnName: "client_id" })
  aud: string;

  @CreateDateColumn({ name: "created_at" })
  created_at?: Date;
}

@Entity({
  name: "oauth_device_codes",
  engine: "MyISAM",
})
export class OAuthDeviceCodeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: "varchar",
  })
  client_id: string;

  @Column({
    type: "varchar",
    nullable: true,
    default: null,
  })
  user_uuid?: string;

  @Column({
    type: "varchar",
    nullable: true,
    default: null,
  })
  scope?: string;

  @Column({
    type: "varchar",
  })
  user_code: string;

  @Column({
    type: "varchar",
  })
  device_code: string;

  @Column({
    type: "numeric",
  })
  interval: number;

  @Column({
    type: "boolean",
    default: false,
  })
  authorized?: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  denied?: boolean;

  @Column({
    type: "numeric",
  })
  expires_at: number;

  @CreateDateColumn({ name: "created_at" })
  created_at?: Date;

  getEndpointData?() {
    return {
      verification_uri: Config.FRONTEND.url + "/activate",
      user_code: this.user_code,
      device_code: this.device_code,
      interval: this.interval,
      expires_in: 1800,
    };
  }
}
