import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AppState, AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, (state: AuthState) => state.isAuthenticated);

export const selectSession = createSelector(selectAuthState, (state: AuthState) => state.session);
export const selectSessions = createSelector( selectAuthState, (state: AuthState) => state.sessions);

export const selectAuthSigninError = createSelector( selectAuthState, (state: AuthState) => state.signin.error);
export const selectAuthSigninErrors = createSelector(selectAuthState, (state: AuthState) => state.signin.errors);
export const selectAuthSigninLoading = createSelector( selectAuthState, (state: AuthState) => state.signin.loading);
export const selectAuthSigninShowForm = createSelector(selectAuthState, (state: AuthState) => state.signin.showForm);

export const selectAuthSignupError = createSelector( selectAuthState, (state: AuthState) => state.signup.error);
export const selectAuthSignupErrors = createSelector(selectAuthState, (state: AuthState) => state.signup.errors);
export const selectAuthSignupLoading = createSelector( selectAuthState, (state: AuthState) => state.signup.loading);

export const selectAuthType = createSelector(selectAuthState, (state: AuthState) => state.type);

export const selectAuthAuthorizeConsent = createSelector( selectAuthState, (state: AuthState) => state.authorizeConsent);

export const selectAuthMultifactor = createSelector( selectAuthState, (state: AuthState) => state.mfa);

export const selectAuthAppInfoData = createSelector( selectAuthState, (state: AuthState) => state.appInfo.data);
export const selectAuthAppInfoOrganization = createSelector( selectAuthState, (state: AuthState) => state.appInfo.data ? state.appInfo.data.organization : null);
export const selectAuthAppInfoLoading = createSelector( selectAuthState, (state: AuthState) => state.appInfo.loading);
export const selectAuthAppInfoLoaded = createSelector( selectAuthState, (state: AuthState) => state.appInfo.loaded);
export const selectAuthAppInfoError = createSelector( selectAuthState, (state: AuthState) => state.appInfo.error);