import { IAuthConsent } from "@core/interfaces/IAuth";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";

export interface AuthState {
  isAuthenticated: boolean;
  session: ISession;
  type: "auth" | "reauth" | "multifactor" | "consent";
  authorizeConsent: IAuthConsent;
  mfa: {
    type: string;
    token: string;
  };
  signin: {
    showForm: boolean;
    loading: boolean;
    error: string;
    errors?: any[]
  };
  signup: {
    loading: boolean;
    message: string;
    error: string;
    errors?: any[]
  };
  appInfo: {
    data: IOAuth2Client;
    loading: boolean;
    loaded: boolean;
    error: string;
  };
  completeConnectProvider: {
    loading: boolean;
    message: string;
    error: string;
    type: string;
  }
}

export interface ISession {
  logged: boolean;
  id: string;
  username: string;
  email: string;
  picture: string;
  role: string;
}
