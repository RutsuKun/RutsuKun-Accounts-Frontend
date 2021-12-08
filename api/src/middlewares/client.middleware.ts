import {
  Middleware,
  Next,
  Req,
  Res,
  Inject,
  InjectorService,
} from "@tsed/common";
import { ClientService } from "@services/ClientService";

@Middleware()
export class CheckClientMiddleware {
  private clientService: ClientService = null;

  @Inject()
  injector: InjectorService;

  constructor() {}

  $onInit() {
    this.clientService = this.injector.get<ClientService>(ClientService);
  }

  use(@Req() req: Req, @Res() res: Res, @Next() next: Next) {
    let clientId;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[0] === "Basic") {
      const base64 = authHeader.split(" ")[1];
      let buff = new Buffer(base64, "base64");
      let clientCredentials = buff.toString("ascii");
      clientId = clientCredentials.split(":")[0];
    }
    const client_id = clientId || req.body.client_id || undefined;

    if (!client_id)
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Parameter client_id is required",
      });

    this.clientService
      .getClientByClientId(client_id)
      .then((client) => {
        // @ts-ignore
        req.oauthClient = client;
        next();
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  }
}
