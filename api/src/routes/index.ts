import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { Config } from "@config";
import { Request, Response } from "express";
import { MailService } from "@services/MailService";
import { Format } from "@utils";

@Controller("/")
export class IndexRoute {
  constructor(private mailService: MailService) {}

  @Get("")
  getIndex(req: Request, res: Response) {
    return res.status(200).json({
      service: Config.appInfo.name,
      versions: ["/v1"],
      environment: Config.Environment.NODE_ENV,
      uptime: Format.formatSeconds(process.uptime())
    });
  }
}
