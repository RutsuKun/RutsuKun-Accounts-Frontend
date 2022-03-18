import { EntityRepository, Repository } from "typeorm";
import { AccountSession } from "@entities/AccountSession";

@EntityRepository(AccountSession)
export class AccountSessionRepository extends Repository<AccountSession> {
  findAll(): Promise<AccountSession[] | undefined> {
    return this.find();
  }
}
