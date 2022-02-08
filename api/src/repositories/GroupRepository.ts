import { EntityRepository, Repository } from "typeorm";
import { AccountGroup } from "@entities/AccountGroup";

@EntityRepository(AccountGroup)
export class GroupRepository extends Repository<AccountGroup> {
  findAll(): Promise<AccountGroup[] | undefined> {
    return this.find({
      relations: ["accounts"],
    });
  }
}
