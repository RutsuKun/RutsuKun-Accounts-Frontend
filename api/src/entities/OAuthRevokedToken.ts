import { Column, CreateDateColumn, Entity, Generated, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { AccountEntity } from "./Account";
import { ClientEntity } from "./Client";

@Entity({
  name: "oauth_revoked_tokens",
  engine: "InnoDB",
})
export class OAuthRevokedToken {
  @PrimaryColumn()
  @Generated("uuid")
  uuid?: string;
  
  @Column({ type: "varchar" })
  type: "access_token" | "refresh_token";
  
  @Column({ type: "varchar" })
  jti: string;
  
  @Column({ type: "numeric" })
  exp: number;
  
  @OneToOne((type) => AccountEntity, (account) => account.uuid, { cascade: true })
  @JoinColumn({ name: "sub", referencedColumnName: "uuid" })
  sub: string;
  
  @OneToOne((type) => ClientEntity, (client) => client.client_id, { cascade: true })
  @JoinColumn({ name: "aud", referencedColumnName: "client_id" })
  aud: string;
  
  @CreateDateColumn({ name: "created_at" })
  created_at?: Date;
}