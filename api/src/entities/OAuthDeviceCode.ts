import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Config } from "@config";

@Entity({
  name: "oauth_device_codes",
  engine: "InnoDB",
})
export class OAuthDeviceCode {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar" })
  client_id: string;

  @Column({ type: "varchar", nullable: true, default: null })
  user_uuid?: string;

  @Column({ type: "varchar", nullable: true, default: null })
  scope?: string;

  @Column({ type: "varchar" })
  user_code: string;

  @Column({ type: "varchar" })
  device_code: string;

  @Column({ type: "numeric" })
  interval: number;

  @Column({ type: "boolean", default: false })
  authorized?: boolean;

  @Column({ type: "boolean", default: false })
  denied?: boolean;

  @Column({ type: "numeric" })
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