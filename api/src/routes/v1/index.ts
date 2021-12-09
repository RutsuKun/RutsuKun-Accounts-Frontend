import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { Config } from "@config";
import { Req, Res } from "@tsed/common";

@Controller("/")
export class V1IndexRoute {
  constructor() {}

  @Get()
  public getIndex(@Req() request: Req, @Res() response: Res) {
    return response.status(200).json({
      service: Config.appInfo.name,
      version: "v1",
      environment: Config.Environment.NODE_ENV,
    });
  }
}
