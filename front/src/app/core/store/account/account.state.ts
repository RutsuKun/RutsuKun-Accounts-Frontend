import { IAccount } from "@core/interfaces/IAccount";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";

export interface AccountState {
  me: {
    data: IAccount;
    loading: boolean;
    loaded: boolean;
    error: string;  
  },
  mfa: {
    data: {
      type: 'otp',
      qrcode: string,
      url: string,
      secret: string;
    },
    error: string;
    loading: boolean;
  },
  createEmail: {
    loading: boolean;
    error: boolean;
  },
  deleteEmail: {
    loading: boolean;
    error: boolean;
  },
  clients: {
    data: IOAuth2Client[];
    loading: boolean;
    loaded: boolean;
    error: string;
  },
  createClient: {
    loading: boolean;
    error: boolean;
  },
  viewClient: {
    data: IOAuth2Client;
    loading: boolean;
    error: string;
  }
}
  