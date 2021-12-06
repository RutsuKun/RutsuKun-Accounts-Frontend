import * as express from "express"
import { SessionData } from "./src/services/SessionService";

declare global {
  namespace Express {
    export interface Response {
      user?: User,
      client?: any,
    }
    export interface Request {
      client?:any,
      info?:any,
      session?:any,
      locale?:any,
      ipInfo?: any,
      userSession: SessionData;
      oauthClient: any;
    }
    export interface User {
      sub?: string;
      logged: boolean;
      username?: string;
      audience?: string;
      scope?: any
    } 
  } 
}

