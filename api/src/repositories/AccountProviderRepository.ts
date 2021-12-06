import { EntityRepository, Repository } from "typeorm";
import { AccountProvider } from "@entities/AccountProvider";

@EntityRepository(AccountProvider)
export class AccountProviderRepository extends Repository<AccountProvider> {
  findAll(): Promise<AccountProvider[] | undefined> {
    return this.find();
  }

  findByProvider(providerAccountId: string, providerId: string) {
    return this.findOne({
      where: {
        provider: providerId,
        id: providerAccountId,
      },
      relations: ["account", "account.emails"],
    });
  }
}
