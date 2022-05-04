import { IAccount, IAccountEmail, IAccountProvider } from "@core/interfaces/IAccount";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";
import { createAction, props } from "@ngrx/store";
import { Subject } from "rxjs";
import { IBrowserSession } from "../auth/auth.state";

// fetch me

export const accountMeRequest = createAction(
  "[Account] Me - Request"
);

export const accountMeSuccess = createAction(
  "[Account] Me - Success",
  props<{ data: IAccount }>()
);

export const accountMeFail = createAction(
  "[Account] Me - Fail",
  props<{ error: any }>()
);

// fetch sessions

export const accountSessionsRequest = createAction(
  "[Account] Sessions - Request"
);

export const accountSessionsSuccess = createAction(
  "[Account] Sessions - Success",
  props<{ data: IBrowserSession[] }>()
);

export const accountSessionsFail = createAction(
  "[Account] Sessions - Fail",
  props<{ error: any }>()
);

// fetch providers

export const accountProvidersRequest = createAction(
  "[Account] Providers - Request"
);

export const accountProvidersSuccess = createAction(
  "[Account] Providers - Success",
  props<{ data: IAccountProvider[] }>()
);

export const accountProvidersFail = createAction(
  "[Account] Providers - Fail",
  props<{ error: any }>()
);

// create email

export const accountEmailsCreateRequest = createAction(
  "[Account] Emails Create - Request",
  props<{ email: string }>()
);

export const accountEmailsCreateSuccess = createAction(
  "[Account] Emails Create - Success",
  props<{ data: IAccountEmail }>()
);

export const accountEmailsCreateFail = createAction(
  "[Account] Emails Create - Fail",
  props<{ error: any }>()
);

// delete email

export const accountEmailsDeleteRequest = createAction(
  "[Account] Emails Delete - Request",
  props<{ uuid: string }>()
);

export const accountEmailsDeleteSuccess = createAction(
  "[Account] Emails Delete - Success",
  props<{ uuid: string }>()
);

export const accountEmailsDeleteFail = createAction(
  "[Account] Emails Delete - Fail",
  props<{ error: any }>()
);

// fetch clients

export const accountClientsRequest = createAction(
  "[Account] Clients - Request"
);

export const accountClientsSuccess = createAction(
  "[Account] Clients - Success",
  props<{ data: IOAuth2Client[] }>()
);

export const accountClientsFail = createAction(
  "[Account] Clients - Fail",
  props<{ error: any }>()
);

// create client

export const accountClientsCreateRequest = createAction(
  "[Account] Clients Create - Request",
  props<{ data: any }>()
);

export const accountClientsCreateSuccess = createAction(
  "[Account] Clients Create - Success",
  props<{ data: IOAuth2Client[] }>()
);

export const accountClientsCreateFail = createAction(
  "[Account] Clients Create - Fail",
  props<{ error: any }>()
);

// fetch client

export const accountClientFetchRequest = createAction(
  "[Account] Client Fetch - Request",
  props<{ client_id: string }>()
);

export const accountClientFetchSuccess = createAction(
  "[Account] Client Fetch - Success",
  props<{ data: IOAuth2Client }>()
);

export const accountClientFetchFail = createAction(
  "[Account] Client Fetch - Fail",
  props<{ error: any }>()
);

// mfa init flow

export const accountMfaInitFlowRequest = createAction(
  "[Account] Mfa Init Flow - Request",
  props<{ flow: "otp" }>()
);

export const accountMfaInitFlowSuccess = createAction(
  "[Account] Mfa Init Flow - Success",
  props<{ data: any }>()
);

export const accountMfaInitFlowFail = createAction(
  "[Account] Mfa Init Flow - Fail",
  props<{ error: any }>()
);

// mfa finish flow

export const accountMfaFinishFlowRequest = createAction(
  "[Account] Mfa Finish Flow - Request",
  props<{ code: string }>()
);

export const accountMfaFinishFlowSuccess = createAction(
  "[Account] Mfa Finish Flow - Success",
  props<{ data: any }>()
);

export const accountMfaFinishFlowFail = createAction(
  "[Account] Mfa Finish Flow - Fail",
  props<{ error: any }>()
);

// mfa disable

export const accountMfaDisableRequest = createAction(
  "[Account] Mfa Disable - Request",
  props<{ mfa_type: string }>()
);

export const accountMfaDisableSuccess = createAction(
  "[Account] Mfa Disable - Success",
  props<{ data: any }>()
);

export const accountMfaDisableFail = createAction(
  "[Account] Mfa Disable - Fail",
  props<{ error: any }>()
);