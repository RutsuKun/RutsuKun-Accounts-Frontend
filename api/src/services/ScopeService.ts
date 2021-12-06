import { Injectable } from "@tsed/di";
import { LoggerService } from "@services/LoggerService";

@Injectable()
export class ScopeService {
  private running;
  private logger: LoggerService;

  constructor(private loggerService: LoggerService) {
    this.logger = this.loggerService.child({
      label: {
        type: "scope",
        name: "Scope Service",
      },
    });
  }

  public healthy() {
    const ctx = this;
    ctx.logger.info("Requested Scope Component Healthy Check");
    const healthy = {
      name: "Scope",
      slug: "scope",
      healthy: ctx.running,
    };
    return healthy;
  }

  public getScopes(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // const scopes = await this.database.scope.find({});
      // resolve(scopes);
      resolve([]);
    });
  }

  public addScope(scope, description): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve) => {
      // const dataToSave = {
      //     scope,
      //     description
      // };
      // const newScope = new ctx.database.scope(dataToSave);
      // newScope.save();
      // return resolve(newScope);
    });
  }

  public deleteScope(scopeId): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve, reject) => {
      // ctx.database.scope.deleteOne({ "_id": scopeId }).then((res) => {
      //     if (res.deletedCount > 0) {
      //         resolve("Scope deleted");
      //     } else {
      //         reject("Scope doesn't exist or already deleted")
      //     }
      // });
    });
  }
}
