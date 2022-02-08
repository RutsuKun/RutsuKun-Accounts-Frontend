import {
    Column,
    Entity,
    Generated,
    ManyToMany,
    PrimaryColumn,
  } from "typeorm";
import { AccountEntity } from "./Account";
import { AccountGroup } from "./AccountGroup";
import { OAuthClientACL } from "./OAuthClientACL";
  
@Entity({
  name: "oauth_scopes",
  engine: "InnoDB",
})
export class OAuthScope {
  constructor(scope: OAuthScope) {
    Object.assign(this, scope);
  }
  
  @Generated("uuid")
  @Column()
  uuid?: string;

  @Column({ type: 'boolean' })
  default: boolean;

  @PrimaryColumn()
  name: string;

  @ManyToMany(() => OAuthClientACL, (acl) => acl.scopes, { cascade: true })
  acls?: OAuthClientACL[];
  
  @ManyToMany(() => AccountEntity, (account) => account.scopes, { cascade: true })
  accounts?: AccountEntity[];

  @ManyToMany(() => AccountGroup, (group) => group.scopes, { cascade: true })
  groups?: AccountGroup[];

}
  