import { EntityRepository, Repository } from "typeorm";
import { AccountEntity } from "@entities/Account";
import { Email } from "@entities/Email";

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  findAll(): Promise<Email[] | undefined> {
    return this.find();
  }

  findByPrimaryEmail(email: string) {
    return this.findOne({
      where: {
        email: email,
        primary: true,
      },
      relations: ["account", "account.emails", "account.providers"],
    });
  }
}
