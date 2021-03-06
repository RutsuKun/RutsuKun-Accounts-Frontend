import { IAuthConsent } from "@core/interfaces/IAuth";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";
import { createAction, props } from "@ngrx/store";
import { IBrowserSession, ISession } from "./auth.state"

// fetch session

export const authSessionFetchRequest = createAction(
  "[Auth] Session Fetch - Request"
);
export const authSessionFetchSuccess = createAction(
  "[Auth] Session Fetch - Success",
  props<{ data: ISession }>()
);
export const authSessionFetchFail = createAction(
  "[Auth] Session Fetch - Fail",
  props<{ error: any }>()
);

// end session

export const authSessionEndRequest = createAction(
  "[Auth] Session End - Request"
);
export const authSessionEndSuccess = createAction(
  "[Auth] Session End - Success",
  props<{ data: ISession }>()
);
export const authSessionEndFail = createAction(
  "[Auth] Session End - Fail",
  props<{ error: any }>()
);

// fetch sessions

export const authSessionsFetchRequest = createAction(
  "[Auth] Sessions Fetch - Request"
);
export const authSessionsFetchSuccess = createAction(
  "[Auth] Sessions Fetch - Success",
  props<{ data: IBrowserSession[] }>()
);
export const authSessionsFetchFail = createAction(
  "[Auth] Sessions Fetch - Fail",
  props<{ error: any }>()
);

// change session

export const authSessionsChangeRequest = createAction(
  "[Auth] Sessions Change - Request",
  props<{ uuid: string }>()
);
export const authSessionsChangeSuccess = createAction(
  "[Auth] Sessions Change - Success",
  props<{ success: boolean }>()
);
export const authSessionsChangeFail = createAction(
  "[Auth] Sessions Change - Fail",
  props<{ error: any }>()
);

// auth check

export const authCheckRequest = createAction(
  "[Auth] Check - Request",
  props<{ flow: "auth" | "oauth", prompt: "login" | "consent" | "signup" | "none" | "select_account" }>()
);
export const authCheckSuccess = createAction(
  "[Auth] Check - Success",
  props<{ data: { type: "auth" | "reauth" | "multifactor" | "consent", multifactor?: { type: string, token: string }, consent?: IAuthConsent } }>()
);
export const authCheckFail = createAction(
  "[Auth] Check - Fail",
  props<{ data: any }>()
);

// auth signin

export const authSigninRequest = createAction(
  "[Auth] Signin - Request",
  props<{ data: any }>()
);
export const authSigninSuccess = createAction(
  "[Auth] Signin - Success",
  props<{ data: any }>()
);
export const authSigninFail = createAction(
  "[Auth] Signin - Fail",
  props<{ error: string, errors: any[] }>()
);

// auth signup

export const authSignupRequest = createAction(
  "[Auth] Signup - Request",
  props<{ data: { username: string; email: string; password: string; repassword: string; captcha: string; } }>()
);
export const authSignupSuccess = createAction(
  "[Auth] Signup - Success",
  props<{ data: { type: string; } }>()
);
export const authSignupFail = createAction(
  "[Auth] Signup - Fail",
  props<{ data: { type: string; error: string; } }>()
);

// auth multifactor

export const authMultifactorRequest = createAction(
  "[Auth] Multifactor - Request",
  props<{ code: any }>()
);
export const authMultifactorSuccess = createAction(
  "[Auth] Multifactor - Success",
  props<{ data: any }>()
);
export const authMultifactorFail = createAction(
  "[Auth] Multifactor - Fail",
  props<{ error: any }>()
);

// auth reauth

export const authReAuthRequest = createAction(
  "[Auth] Re Auth - Request",
  props<{ data: any }>()
);
export const authReAuthSuccess = createAction(
  "[Auth] Re Auth - Success",
  props<{ data: any }>()
);
export const authReAuthFail = createAction(
  "[Auth] Re Auth - Fail",
  props<{ error: any }>()
);

// auth authorize

export const authAuthorizeRequest = createAction(
  "[Auth] Authorize - Request",
  props<{ scope: string, consentGiven: boolean, captcha?: string }>()
);
export const authAuthorizeSuccess = createAction(
  "[Auth] Authorize - Success",
  props<{ data: any }>()
);
export const authAuthorizeFail = createAction(
  "[Auth] Authorize - Fail",
  props<{ error: any }>()
);

// auth signin

export const authChooseAccountRequest = createAction(
  "[Auth] Choose Account - Request",
  props<{ account_uuid: any }>()
);
export const authChooseAccountSuccess = createAction(
  "[Auth] Choose Account - Success",
  props<{ data: any }>()
);
export const authChooseAccountFail = createAction(
  "[Auth] Choose Account - Fail",
  props<{ error: string }>()
);

// fetch app info

export const authAppInfoRequest = createAction(
  "[Auth] App Info - Request",
  props<{ client_id: string }>()
);
export const authAppInfoSuccess = createAction(
  "[Auth] App Info - Success",
  props<{ data: IOAuth2Client }>()
);
export const authAppInfoFail = createAction(
  "[Auth] App Info - Fail",
  props<{ error: any }>()
);

// auth complete connect provider

export const authCompleteConnectProviderRequest = createAction(
  "[Auth] Complete Connect Provider - Request",
  props<{ email: string, code?: string }>()
);
export const authCompleteConnectProviderSuccess = createAction(
  "[Auth] Complete Connect Provider - Success",
  props<{ data: any }>()
);
export const authCompleteConnectProviderFail = createAction(
  "[Auth] Complete Connect Provider - Fail",
  props<{ error: any }>()
);