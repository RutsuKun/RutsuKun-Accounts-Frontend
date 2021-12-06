import { Controller } from "@tsed/di";
import { Get } from "@tsed/schema";
import { Config } from "@config";
import { Request, Response } from "express";
import { RouteV1Endpoints } from "./v1";
import { WellKnownRoute } from "./wellknown";

@Controller('')
export class IndexRoute {
    constructor() { }

    @Get('')
    getIndex(req: Request, res: Response) {
        return res.status(200).json({
            service: Config.appInfo.name,
            versions: ["/v1"],
            environment: Config.Environment.NODE_ENV
        });
    };
}

const routes = {
    v1: {
        endpoints: RouteV1Endpoints
    },
    routes: {
        WellKnownRoute,
        IndexRoute
    }
}

export default routes;