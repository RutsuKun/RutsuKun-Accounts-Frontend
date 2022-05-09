import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from './account.state';

export const selectAccountState = createFeatureSelector<AccountState>('account');

export const selectMeData = createSelector(selectAccountState, (state: AccountState) => state.me.data);
export const selectMeLoading = createSelector(selectAccountState, (state: AccountState) => state.me.loading);
export const selectMeLoaded = createSelector(selectAccountState, (state: AccountState) => state.me.loaded);
export const selectMeError = createSelector(selectAccountState, (state: AccountState) => state.me.error);

export const selectSessionsData = createSelector(selectAccountState, (state: AccountState) => state.sessions.data);
export const selectSessionsLoading = createSelector(selectAccountState, (state: AccountState) => state.sessions.loading);
export const selectSessionsLoaded = createSelector(selectAccountState, (state: AccountState) => state.sessions.loaded);
export const selectSessionsError = createSelector(selectAccountState, (state: AccountState) => state.sessions.error);

export const selectProvidersData = createSelector(selectAccountState, (state: AccountState) => state.providers.data);
export const selectProvidersLoading = createSelector(selectAccountState, (state: AccountState) => state.providers.loading);
export const selectProvidersLoaded = createSelector(selectAccountState, (state: AccountState) => state.providers.loaded);
export const selectProvidersError = createSelector(selectAccountState, (state: AccountState) => state.providers.error);

export const selectAuthorizationsData = createSelector(selectAccountState, (state: AccountState) => state.authorizations.data);
export const selectAuthorizationsLoading = createSelector(selectAccountState, (state: AccountState) => state.authorizations.loading);
export const selectAuthorizationsLoaded = createSelector(selectAccountState, (state: AccountState) => state.authorizations.loaded);
export const selectAuthorizationsError = createSelector(selectAccountState, (state: AccountState) => state.authorizations.error);

export const selectEmailCreateLoading = createSelector(selectAccountState, (state: AccountState) => state.createEmail.loading);
export const selectEmailCreateError = createSelector(selectAccountState, (state: AccountState) => state.createEmail.error);

export const selectEmailDeleteLoading = createSelector(selectAccountState, (state: AccountState) => state.deleteEmail.loading);
export const selectEmailDeleteError = createSelector(selectAccountState, (state: AccountState) => state.deleteEmail.error);

export const selectClientsData = createSelector(selectAccountState, (state: AccountState) => state.clients.data);
export const selectClientsLoading = createSelector(selectAccountState, (state: AccountState) => state.clients.loading);
export const selectClientsLoaded = createSelector(selectAccountState, (state: AccountState) => state.clients.loaded);
export const selectClientsError = createSelector(selectAccountState, (state: AccountState) => state.clients.error);

export const selectClientCreateLoading = createSelector(selectAccountState, (state: AccountState) => state.createClient.loading);
export const selectClientCreateError = createSelector(selectAccountState, (state: AccountState) => state.createClient.error);

export const selectClientViewData = createSelector(selectAccountState, (state: AccountState) => state.viewClient.data);
export const selectClientViewLoading = createSelector(selectAccountState, (state: AccountState) => state.viewClient.loading);
export const selectClientViewError = createSelector(selectAccountState, (state: AccountState) => state.viewClient.error);

export const selectMfaData = createSelector(selectAccountState, (state: AccountState) => state.mfa.data);
export const selectMfaLoading = createSelector(selectAccountState, (state: AccountState) => state.mfa.loading);
export const selectMfaError = createSelector(selectAccountState, (state: AccountState) => state.mfa.error);

