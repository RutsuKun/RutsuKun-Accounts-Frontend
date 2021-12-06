import { EntityRepository, Repository } from "typeorm";
import { ClientEntity } from "@entities/Client";

@EntityRepository(ClientEntity)
export class ClientRepository extends Repository<ClientEntity> {
  findAll(): Promise<ClientEntity | undefined> {
    return this.findAll();
  }
  findByUUID(uuid: string): Promise<ClientEntity | undefined> {
    return this.findOne({ uuid: uuid });
  }
  findByClientID(client_id: string) {
    return this.findOne({ client_id }, { relations: ["account"] });
  }
  createAccount(client: ClientEntity): Promise<ClientEntity | undefined> {
    return this.save(client);
  }
}
