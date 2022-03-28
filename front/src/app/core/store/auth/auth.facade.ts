import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../';
import * as a from './auth.actions';
import * as s from './auth.selectors';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: "root",
})
export class AuthFacade {
  isAuthenticated$ = this.store.pipe(select(s.selectIsAuthenticated));
  session$ = this.store.pipe(select(s.selectSession));
  sessions$ = this.store.pipe(select(s.selectSessions));
  sessionCurrent$ = this.store.pipe(select(s.selectSessionsCurrent));
  sessionsOther$ = this.store.pipe(select(s.selectSessionsOther));

  signinShowForm$ = this.store.pipe(select(s.selectAuthSigninShowForm));
  signinError$ = this.store.pipe(select(s.selectAuthSigninError));
  signinLoading$ = this.store.pipe(select(s.selectAuthSigninLoading));

  signupError$ = this.store.pipe(select(s.selectAuthSignupError));
  signupLoading$ = this.store.pipe(select(s.selectAuthSignupLoading));

  type$ = this.store.pipe(select(s.selectAuthType));
  authorizeConsent$ = this.store.pipe(select(s.selectAuthAuthorizeConsent));
  mfa$ = this.store.pipe(select(s.selectAuthMultifactor));

  appInfoData$ = this.store.pipe(select(s.selectAuthAppInfoData));
  appInfoOrganization$ = this.store.pipe(
    select(s.selectAuthAppInfoOrganization)
  );
  appInfoLoading$ = this.store.pipe(select(s.selectAuthAppInfoLoading));
  appInfoLoaded$ = this.store.pipe(select(s.selectAuthAppInfoLoaded));
  appInfoError$ = this.store.pipe(select(s.selectAuthAppInfoError));

  constructor(private store: Store<AppState>) {}

  endSession() {
    this.store.dispatch(a.authSessionEndRequest());
  }

  fetchSessions() {
    this.store.dispatch(a.authSessionsFetchRequest());
  }

  changeSession(uuid: string) {
    this.store.dispatch(a.authSessionsChangeRequest({ uuid }));
  }

  check(flow: "auth" | "oauth") {
    this.store.dispatch(a.authCheckRequest({ flow }));
  }

  signin(data: any) {
    this.store.dispatch(a.authSigninRequest({ data }));
  }

  signup(data: {
    username: string;
    email: string;
    password: string;
    repassword: string;
    captcha: string;
  }) {
    this.store.dispatch(a.authSignupRequest({ data }));
  }

  multifactorOTP(code: string) {
    this.store.dispatch(a.authMultifactorRequest({ code }));
  }

  reauth(data: any) {
    this.store.dispatch(a.authReAuthRequest({ data }));
  }

  authorize({ consentGiven, scope }) {
    this.store.dispatch(a.authAuthorizeRequest({ consentGiven, scope }));
  }

  logout() {
    // this.store.dispatch(a.authLogout());
  }

  fetchAppInfo(client_id: string) {
    this.store.dispatch(a.authAppInfoRequest({ client_id }));
  }

  completeConnectProvider(email: string, code?: string) {
    this.store.dispatch(a.authCompleteConnectProviderRequest({ email, code }));
  }
}
