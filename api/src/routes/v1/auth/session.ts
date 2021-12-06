import { Request, Response } from "express";
import { SessionService } from "@services/SessionService";

export const GET_AuthSessionRoute = (session: SessionService) => {
  return (req: Request, res: Response) => {
    if (session.session && session.getUser) {
      //   if (req.session.user.impersonate) {
      //     return res.status(200).json(req.session.user.impersonate);
      //   }
      res.status(200).json(session.getUser);
    } else {
      res.status(200).json({ logged: false });
    }
  };
};

export const GET_AuthSessionDetailsRoute = (session: SessionService) => {
  return (req: Request, res: Response) => {
    res.status(200).json(req.session);
  };
};

export const GET_AuthSessionEndRoute = (session: SessionService) => {
  return (req: Request, res: Response) => {
    const { id_token_hint, post_logout_redirect_uri } = req.query;
    if (!post_logout_redirect_uri) {
      const response = {
        type: "error",
        error: "invalid_request",
        error_description: "Parameter post_logout_redirect_uri required",
      };
      return res.status(200).json(response);
    }

    if (session.getUser && session.getUser.id) {
      session
        .setUser({ logged: false })
        .delPassport()
        .delAction()
        .saveSession();
    }

    return res.redirect(post_logout_redirect_uri as string);
  };
};

export const POST_AuthSessionEndRoute = (session: SessionService) => {
  return (req: Request, res: Response) => {
    if (session.getUser && session.getUser.id) {
      /**if(req.session.user.impersonate){
				delete req.session.user.impersonate;
				return res.status(200).json({
					type: "impersonate", 
					action: "logged-out"
				})
			}**/

      session
        .setUser({ logged: false })
        .delPassport()
        .delAction()
        .delIDC()
        .saveSession();

      res.status(200).json(session.getUser);
    } else {
      res.status(200).json({ logged: false });
    }
  };
};
