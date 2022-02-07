import { EntityRepository, Repository } from "typeorm";
import { AccountAuthnMethod } from "@entities/AccountAuthnMethod";

@EntityRepository(AccountAuthnMethod)
export class AccountAuthnMethodRepository extends Repository<AccountAuthnMethod> {
  findAll(): Promise<AccountAuthnMethod[] | undefined> {
    return this.find();
  }
}
