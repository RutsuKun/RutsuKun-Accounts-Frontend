export interface IAuthConsent {
    client: {
        id: string;
        logo_uri: string;
        name: string;
    },
    scope: string;
}