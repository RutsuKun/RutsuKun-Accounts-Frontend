import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ClientEntity } from "./Client";

@Entity({
  name: "oauth_clients_organizations",
  engine: "InnoDB",
})
export class OAuthClientOrganization {
  constructor(org?: OAuthClientOrganization) {
    if(org) {
      Object.assign(this, org);
    }
  }

  @PrimaryColumn()
  @Generated("uuid")
  uuid?: string;

  @OneToOne(() => ClientEntity, (client) => client.acl, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name: "client_id",
    referencedColumnName: "client_id",
  })
  client?: ClientEntity;


  @Column({
    type: "varchar",
    nullable: false
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  description: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  domain: string;
}
