export interface IAcl {
  uuid: string;
  client_id: string;
  allowedScopes: string[];
  allowedAccounts: IAclAllowedAccount[];
  allowedGroups: IAclAllowedGroup[];
}

export interface IAclAllowedAccount {
    uuid: string;
    username: string;
    picture: string;
    allowedScopes: string[];
}

export interface IAclAllowedGroup {
    name: string;
    enabled: boolean;
    allowedScopes: string[];
}