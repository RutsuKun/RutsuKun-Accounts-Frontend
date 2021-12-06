import { Injectable } from "@tsed/di";
import { LoggerService } from "./LoggerService";


@Injectable()
export class SettingsService {
  private running: boolean;
  private logger: LoggerService;

  constructor(private loggerService: LoggerService) {
    this.logger = this.loggerService.child({
      label: {
        type: "settings",
        name: "Settings Manager",
      },
    });
  }

  public healthy() {
    const ctx = this;
    ctx.logger.info("Requested Settings Component Healthy Check");
    const healthy = {
      name: "Settings",
      slug: "settings",
      healthy: ctx.running,
    };
    return healthy;
  }

  public getScopesByRole(role: string): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve, reject) => {
      // const settings = await ctx.database.settings.findOne({});
      // if (!settings) {
      // 	reject('First setup settings.')
      // 	return;
      // }
      // const scopes = await settings.roles.filter((item) => {
      // 	if (item.role === role) {
      // 		return item;
      // 	}
      // });
      // resolve(scopes[0].scopes);
    });
  }
}
