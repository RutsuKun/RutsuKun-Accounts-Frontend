import { Injectable, ProviderScope, Request } from "@tsed/common";
import { LoggerService } from "./LoggerService";
@Injectable({
  scope: ProviderScope.REQUEST
})
export class SessionService {
  public session;
  private clientQuery: SessionClientQuery;
  private client: SessionClient;
  private user: SessionUser;
  private idp: SessionIDP;
  private sso: ISessionSSO[] = [];
  private action: any;
  private flow: "auth" | "oauth";
  private oauth: {
    client_id: string;
  };
  private passport: any;
  private error: any;

  private logger;

  constructor(private loggerService: LoggerService) {
    this.logger = this.loggerService.child({
      label: {
        type: "session",
        name: "Session Serivice",
      },
    });
    return this;
  }

  needReAuth(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const currentTime = Math.floor(Date.now() / 1000);

      const authTime = this.getIDP.auth_time;
      const reauthTime = this.getIDP.reauth_time;

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

      return resolve(false);

      // 1 h after full auth
      if (timeDifferenceAuth > 3600) {
        resolve(true);
      }
      // 10 min after reauth or first auth
      if (timeDifferenceReAuth > 6090000) {
        this.loggerService.info(this.getUser.username + " needs reauth.");
        resolve(true);
      }

      resolve(false);
    });
  }

  setSession(req: Request) {
    this.logger.info('sessionID', req['sessionID']);
    
    this.session = req.session;
    const clientQuery = req.session.clientFromQuery;
    const client = req.session.client;
    const user = req.session.user;
    const idp = req.session.idp;
    const sso = req.session.sso;
    const action = req.session.action;
    const error = req.session.error;

    const flow = req.body.flow || req.session.flow || "auth";

    if (clientQuery) this.setClientQuery(clientQuery);
    if (client) this.setClient(client);
    if (user) {
      this.setUser(user);
    } else {
      this.setUser({ logged: false });
    }
    if (idp) this.setIDP(idp);
    if(sso) this.setSSO(sso);
    if (action) this.setAction(action);
    this.setFlow(flow);
    if (error) this.setError(error);

    return this;
  }

  get getSession(): SessionData {
    return this.session;
  }

  async saveSession() {


    try {
      return new Promise(async (resolve, reject) => {
        if (this.clientQuery) {
          this.session.clientFromQuery = this.clientQuery;
        } else {
          delete this.session.clientFromQuery;
        }
  
        if (this.client) {
          this.session.client = this.client;
        } else {
          delete this.session.client;
        }
  
        if (this.user) {
          this.session.user = this.user;
        } else {
          delete this.session.user;
        }
  
        if (this.idp) {
          this.session.idp = this.idp;
        } else {
          delete this.session.idp;
        }
  
        if (this.sso) {
          this.session.sso = this.sso;
        } else {
          delete this.session.sso;
        }
  
        if (this.action) {
          this.session.action = this.action;
        } else {
          delete this.session.action;
        }
  
        if (this.flow) {
          this.session.flow = this.flow;
        } else {
          delete this.session.flow;
        }
  
        if (this.passport) {
          this.session.passport = this.passport;
        } else {
          delete this.session.passport;
        }
  
        this.session.save(() => {
          this.loggerService.info("Session saved: " + this.session.id);
          resolve(true);
        });
      });
    } catch(err) {
      console.log('important error', err);
    }
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

  // IDP - Identity Provider //

  setIDP(idp: SessionIDP) {
    this.idp = idp;
    return this;
  }

  get getIDP(): SessionIDP {
    return this.idp;
  }

  delIDP() {
    this.loggerService.info("function delIDP");
    this.idp = undefined;
    return this;
  }

  // SSO

  setSSO(sso: ISessionSSO[]) {
    this.sso = sso;
    return this;
  }

  addSSO(sso: ISessionSSO) {
    this.loggerService.info("function addSSO", sso);
    this.sso.push(sso);
    return sso;
  }

  deleteSso(nameId: string, serviceProviderId: string) {
    this.sso = this.sso.filter((sso)=>sso.nameId !== nameId && sso.serviceProviderId !== serviceProviderId);
  }

  get getSso() {
    return this.sso;
  }

  getSsoByNameId(nameId: string) {
    return this.sso.find((ssoSession)=> ssoSession.nameId === nameId);
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
  idp: SessionIDP;
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

export interface SessionIDP {
  session_id: string;
  session_state: string;
  session_issued: Date;
  session_expires: Date;
  sub: string; // user id
  idp: string; // identity provider
  username: string;
  amr: Array<string>;
  auth_time: number;
  reauth_time: number;
  used_authn_methods: IUsedAuthnMethod[];
}

export interface IUsedAuthnMethod {
  method: 'OTP';
  first_used_date: Date;
  last_used_date: Date;
}

export interface ISessionSSO {
  serviceProviderId: string;
  nameId: string;
  nameIdFormat: string;
  sessionIndex: string;
  serviceProviderLogoutURL: string;
}