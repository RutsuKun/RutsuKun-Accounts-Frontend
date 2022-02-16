import { Context, Controller, Delete, Get, Inject, PathParams, Post, Req, Res, UseBefore } from "@tsed/common";

// MIDDLEWARES

import { SessionLoggedMiddleware, SessionMiddleware } from "@middlewares/session.middleware";

// SERVICES

import { LoggerService } from "@services/LoggerService";
import { SessionService } from "@services/SessionService";
import { ClientService } from "@services/ClientService";

import { HTTPCodes } from "@utils";

import { map, timer } from 'rxjs';

@Controller("/oauth2/clients")
export class OAuth2ClientsRoute {
  public logger: LoggerService;
  constructor(
    @Inject() private clientService: ClientService,
    @Inject() private loggerService: LoggerService
  ) {
    this.logger = this.loggerService.child({
      label: { name: "OAuth2", type: "oauth2" },
    });
  }

  @Get("/")
  @UseBefore(SessionLoggedMiddleware)
  @UseBefore(SessionMiddleware)
  public async getClients(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {

    const clients = await this.clientService.getAccountClients(session.getUser.id);

    return timer(2000).pipe(map(() => clients));

  }

  @Post("/")
  @UseBefore(SessionLoggedMiddleware)
  @UseBefore(SessionMiddleware)
  public async postClients(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {
    const data = request.body;
    try {
      const client = await this.clientService.addClient(session.getUser.id, data);
      response.status(HTTPCodes.Created).json(client);
    } catch (err) {
      response.status(HTTPCodes.BadRequest).json({
        error: err,
      });
    }
  }

  @Get("/:client_id")
  public async getClient(
    @Req() request: Req,
    @Res() response: Res,
    @PathParams("client_id") client_id: string
  ) {

    try {
      const client = await this.clientService.getClientByClientId(client_id);
      response.status(HTTPCodes.OK).json(client);
    } catch (error) {
      response.status(HTTPCodes.BadRequest).json({
        error: error,
      });
    }
  }

  @Delete("/:clientId")
  @UseBefore(SessionLoggedMiddleware)
  @UseBefore(SessionMiddleware)
  public deleteClients(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService
  ) {


    const clientId = request.params.clientId;

    this.clientService
      .getClientByClientId(clientId)
      .then((client) => {
        if (session.getUser.id === client.account.uuid) {
          this.clientService
            .deleteClient(clientId)
            .then(() => {
              response.status(HTTPCodes.OK).send();
            })
            .catch((error) => {
              response.status(HTTPCodes.BadRequest).json({
                error: error,
              });
            });
        } else {
          response.status(HTTPCodes.BadRequest).json({
            error: "Can you only delete your own application",
          });
        }
      })
      .catch((error) => {
        response.status(HTTPCodes.BadRequest).json({
          error: error,
        });
      });
  }

  @Get("/:clientId/public")
  public async getClientsPublic(@Req() request: Req, @Res() response: Res) {
    const clientId = request.params.clientId;
    try {
      const client = await this.clientService.getClientByClientId(clientId);
      response.status(HTTPCodes.OK).json({
        client_id: client.client_id,
        name: client.name,
        logo: client.logo,
        privacy_policy: client.privacy_policy,
        tos: client.tos,
        verified: client.verified,
        third_party: client.third_party,
        owner: {
          username: client.account.username,
          avatar: client.account.avatar,
        },
        organization: client.organization ? {
          name: client.organization.name,
          domain: client.organization.domain
        } : null
      });
    } catch (error) {
      response.status(HTTPCodes.BadRequest).json({
        error: error,
      });
    }
  }
}
