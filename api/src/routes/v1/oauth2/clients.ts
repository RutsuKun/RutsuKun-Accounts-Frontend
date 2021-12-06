import { Request, Response } from "express";

import { ClientService } from "@services/ClientService";
import { SessionService } from "@services/SessionService";

import { HTTPCodes } from "@utils";
import { AccountsService } from "@services/AccountsService";

export const GET_ClientsRoute = async (
  sessionService: SessionService,
  clientService: ClientService
) => {
  return async (req: Request, res: Response) => {
    const session = sessionService.getUser;
    const clients = await clientService.getAccountClients(session.id);

    res.status(HTTPCodes.OK).json(clients);
  };
};

export const POST_ClientsRoute = async (
  sessionService: SessionService,
  clientService: ClientService,
  accountsService: AccountsService
) => {
  return async (req: Request, res: Response) => {
    const session = sessionService.getUser;

    const data = req.body;

    try {
      const client = await clientService.addClient(session.id, data);
      res.status(HTTPCodes.Created).json(client);
    } catch (err) {
      res.status(HTTPCodes.BadRequest).json({
        error: err,
      });
    }
  };
};

export const DELETE_ClientsRoute = async (
  sessionService: SessionService,
  clientService: ClientService
  // accountsService: AccountsService
) => {
  return async (req: Request, res: Response) => {
    const session = sessionService.getUser;

    const clientId = req.params.clientId;

    clientService
      .getClientByClientId(clientId)
      .then((client) => {
        if (session.id === client.account.uuid) {
          clientService
            .deleteClient(clientId)
            .then(() => {
              res.status(HTTPCodes.OK).send();
            })
            .catch((error) => {
              res.status(HTTPCodes.BadRequest).json({
                error: error,
              });
            });
        } else {
          res.status(HTTPCodes.BadRequest).json({
            error: "Can you only delete your own application",
          });
        }
      })
      .catch((error) => {
        res.status(HTTPCodes.BadRequest).json({
          error: error,
        });
      });
  };
};
