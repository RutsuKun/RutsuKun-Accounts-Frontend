import {
  Injectable,
  Request,
} from "@tsed/common";
import { LoggerService } from "./LoggerService";

@Injectable()
export class SessionService {
  public session;
  private clientQuery: SessionClientQuery;
  private client: SessionClient;
  private user: SessionUser;
  private idc: SessionIDC;
  private action: any;
  private flow: "auth" | "oauth";
  private oauth: {
    client_id: string;
  };
  private passport: any;
  private error: any;

  constructor(private loggerService: LoggerService) {
    this.loggerService.child({
      label: {
        type: "session",
        name: "Session Serivice",
      },
    });

    return this;
  }

  needReAuth() {
    const ctx = this;
    return new Promise<void>(async (resolve, reject) => {
      const currentTime = Math.floor(Date.now() / 1000);

      const authTime = this.getIDC.auth_time;
      const reauthTime = this.getIDC.reauth_time;

      const timeDifferenceAuth = currentTime - authTime;
      const timeDifferenceReAuth = currentTime - reauthTime;

      console.log(
        "timeDifferenceAuth",
        timeDifferenceAuth,
        " sekund / ",
        3600,
        " sekund"
      );
      console.log(
        "timeDifferenceReAuth",
        timeDifferenceReAuth,
        " sekund / ",
        600,
        " sekund"
      );

      // 1 h after full auth
      if (timeDifferenceAuth > 3600) {
        reject({
          type: "auth",
        });
      }
      // 10 min after reauth or first auth
      if (timeDifferenceReAuth > 600) {
        ctx.loggerService.info(ctx.getUser.username + " needs reauth.");
        reject({
          type: "reauth",
        });
      }

      resolve();
    });
  }

  setSession(req: Request) {
    this.loggerService.info("function setSession");

    this.session = req.session;

    this.loggerService.info("session_id: " + this.session.id);

    const clientQuery = req.session.clientFromQuery;
    const client = req.session.client;
    const user = req.session.user;
    const idc = req.session.idc;
    const action = req.session.action;
    const error = req.session.error;

    const flow = req.body.flow || "oauth";

    if (clientQuery) this.setClientQuery(clientQuery);
    if (client) this.setClient(client);
    if (user) {
      this.setUser(user);
    } else {
      this.setUser({ logged: false });
    }
    if (idc) this.setIDC(idc);
    if (action) this.setAction(action);
    this.setFlow(flow);
    if (error) this.setError(error);

    return this;
  }

  get getSession(): SessionData {
    return this.session;
  }

  async saveSession() {
    this.loggerService.info("function saveSession");
    const ctx = this;

    return new Promise(async (resolve, reject) => {
      if (ctx.clientQuery) {
        ctx.session.clientFromQuery = ctx.clientQuery;
      } else {
        delete ctx.session.clientFromQuery;
      }

      if (ctx.client) {
        ctx.session.client = ctx.client;
      } else {
        delete ctx.session.client;
      }

      if (ctx.user) {
        ctx.session.user = ctx.user;
      } else {
        delete ctx.session.user;
      }

      if (ctx.idc) {
        ctx.session.idc = ctx.idc;
      } else {
        delete ctx.session.idc;
      }

      if (ctx.action) {
        ctx.session.action = ctx.action;
      } else {
        delete ctx.session.action;
      }

      if (ctx.flow) {
        ctx.session.flow = ctx.flow;
      } else {
        delete ctx.session.flow;
      }

      if (ctx.passport) {
        ctx.session.passport = ctx.passport;
      } else {
        delete ctx.session.passport;
      }

      ctx.session.save(() => {
        this.loggerService.info("Session saved: " + ctx.session.id);

        resolve(true);
      });
    });
  }

  // CLIENT QUERY //

  setClientQuery(client) {
    this.clientQuery = client;
    return this;
  }

  get getClientQuery(): SessionClientQuery {
    return this.clientQuery;
  }

  delClientQuery() {
    this.loggerService.info("function delClientQuery");
    this.clientQuery = undefined;
    return this;
  }

  // CLIENT //

  setClient(client) {
    this.client = client;
    return this;
  }

  get getClient(): SessionClient {
    return this.client;
  }

  delClient() {
    this.loggerService.info("function delClient");
    this.client = undefined;
    return this;
  }

  // USER //

  setUser(user: SessionUser) {
    this.user = user;
    return this;
  }

  get getUser(): SessionUser {
    return this.user;
  }

  delUser() {
    this.loggerService.info("function delUser");
    this.user = undefined;
    return this;
  }

  // IDC //

  setIDC(idc) {
    this.idc = idc;
    return this;
  }

  get getIDC(): SessionIDC {
    return this.idc;
  }

  delIDC() {
    this.loggerService.info("function delIDC");
    this.idc = undefined;
    return this;
  }

  // ACTION //

  get getAction() {
    return this.action;
  }

  setAction(action) {
    this.action = action;
    return this;
  }

  delAction() {
    this.loggerService.info("function delAction");
    this.action = undefined;
    return this;
  }

  // FLOW //

  get getFlow() {
    return this.flow;
  }

  setFlow(flow) {
    this.flow = flow;
    return this;
  }

  delFlow() {
    this.loggerService.info("function delFlow");
    this.flow = undefined;
    return this;
  }

  // OAUTH //

  get getOAuth() {
    return this.oauth;
  }

  setOAuth(oauth) {
    this.oauth = oauth;
    return this;
  }

  delOAuth() {
    this.loggerService.info("function delOAuth");
    this.oauth = null;
    return this;
  }

  // PASSPORT //

  get getPassport() {
    return this.action;
  }

  setPassport(passport) {
    this.passport = passport;
    return this;
  }

  delPassport() {
    this.loggerService.info("function delPassport");
    this.passport = undefined;
    return this;
  }

  // ERROR //

  setError(error) {
    this.error = error;
    return this;
  }

  get getError(): any {
    return this.error;
  }

  delError() {
    this.loggerService.info("function delError");
    this.error = undefined;
    return this;
  }
}

export interface SessionData {
  id: string;
  clientFromQuery: SessionClientQuery;
  client: SessionClient;
  cookie: any;
  user: SessionUser;
  idc: SessionIDC;
  action: {
    type: string;
    [index: string]: any;
  };
  oauth: {
    client_id: string;
  };
}

export interface SessionClientQuery {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  acr_values: string;
  scope: string;
  state: string;
  nonce: string;
  prompt: "login" | "signup" | "consent" | "none";
  code_challenge: string;
  code_challenge_method: string;
}

export interface SessionClient {
  registrationEnabled: boolean;
  loginEnabled: boolean;
  client_id: string;
  name: string;
  third_party: boolean;
  grant_types: Array<string>;
  response_types: Array<string>;
  redirect_uris: Array<string>;
  logo: string;
  policy_uri: string;
  tos_uri: string;
  consent: boolean;
  state: string;
  type: string;
  website: string;
  privacy_policy: string;
  tos: string;
  verified: boolean;
}

export interface SessionUser {
  logged: boolean;
  id?: string;
  username?: string;
  email?: string;
  picture?: string;
  role?: string;
}

export interface SessionIDC {
  session_id: string;
  session_issued: Date;
  session_expires: Date;
  sub: string; // user id
  idp: string; // identity provider
  username: string;
  amr: Array<string>;
  auth_time: number;
  reauth_time: number;
}
