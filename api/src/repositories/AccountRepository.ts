import { EntityRepository, Repository } from "typeorm";
import { AccountEntity } from "@entities/Account";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  findAll(): Promise<AccountEntity[] | undefined> {
    return this.find();
  }

  findByUUID(uuid: string): Promise<AccountEntity | undefined> {
    return this.findOne({ uuid: uuid });
  }
  findByPrimaryEmail(email: string) {
    return this.find({
      where: {
        emails: {
          email: email
        }
      },
      relations: ["emails"],
    });
  }
  findByUsername(username: string) {
    return this.findOne({ username: username });
  }
  createAccount(account: AccountEntity): Promise<AccountEntity | undefined> {
    return this.save(account);
  }
}
