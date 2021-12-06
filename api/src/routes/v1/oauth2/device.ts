import { Request, Response } from "express";

import { OAuth2Service } from "@services/OAuth2Service";

export const POST_DeviceRoute = (oauth: OAuth2Service) => {
  return async (req: Request, res: Response) => {
    // @ts-ignore
    const client = req.oauthClient;

    const { scope } = req.body;

    const flow = await oauth.runDeviceCodeFlow(client.client_id, scope);
    return res.status(200).json(flow);
  };
};
