export interface IAccount {
  uuid: string;
  avatar: string;
  banned: boolean;
  emails: IAccountEmail[];
  clients: any[];
  email: string;
  enabled2fa: boolean;
  providers: IAccountProvider[];
  groups: IAccountGroup[];
  authn_methods: IAccountAuthnMethod[];
  role: string;
  secret2fa: string;
  state: string;
  username: string;
  verified_email: boolean;
  version: number;
}

export interface IAccountEmail {
  uuid: string;
  email: string;
  primary: boolean;
  email_verified: boolean;
}

export interface IAccountProvider {
  provider: string;
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface IAccountAuthorization {
  id: number;
  uuid: string;
  client_logo: string;
  client_id: string;
  client_name: string;
  scopes: string[];
}

export interface IAccountGroup {
  uuid: string;
  name: string;
  display_name: string;
  enabled: boolean;
}

export interface IAccountAuthnMethod {
  type: "OTP";
  enabled: boolean;
}
