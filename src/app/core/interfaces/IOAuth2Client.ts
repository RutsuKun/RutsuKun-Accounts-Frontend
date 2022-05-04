export interface IOAuth2Client {
  uuid: string;
  client_id: string;
  secret: string;

  redirect_uris: string[];
  response_types: ("token" | "code" | "id_token")[];
  grant_types: ("authorization_code" | "client_credentials" | "device_code")[];

  name: string;
  description: string;
  logo: string;
  privacy_policy: string;
  tos: string;
  website: string;
  type: "wsa" | "spa" | "native" | "mobile";

  consent: boolean;
  state: IOAuth2ClientState;
  third_party: boolean;
  verified: boolean;

  organization: {
    name: string;
    domain: string;
  }
}

export enum IOAuth2ClientState {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  DELETED = "DELETED",
}
