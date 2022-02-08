import { IAuthConsent } from "@core/interfaces/IAuth";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";
import { createAction, props } from "@ngrx/store";
import { ISession } from "./auth.state"

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

// auth check

export const authCheckRequest = createAction(
  "[Auth] Check - Request",
  props<{ flow: "auth" | "oauth" }>()
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

// auth signin

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

// auth re auth

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