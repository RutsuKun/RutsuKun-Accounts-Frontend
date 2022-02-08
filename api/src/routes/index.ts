import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { Config } from "@config";
import { Request, Response } from "express";

@Controller("")
export class IndexRoute {
  constructor() {}

  @Get("")
  getIndex(req: Request, res: Response) {
    return res.status(200).json({
      service: Config.appInfo.name,
      versions: ["/v1"],
      environment: Config.Environment.NODE_ENV,
    });
  }
}
