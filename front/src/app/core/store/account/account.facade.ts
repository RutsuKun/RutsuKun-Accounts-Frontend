import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '..';
import * as a from './account.actions';
import * as s from './account.selectors';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { IOAuth2Client } from '@core/interfaces/IOAuth2Client';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: "root",
})
export class AccountFacade {
  // me
  meData$ = this.store.pipe(select(s.selectMeData));
  meLoading$ = this.store.pipe(select(s.selectMeLoading));
  meLoaded$ = this.store.pipe(select(s.selectMeLoaded));
  meError$ = this.store.pipe(select(s.selectMeError));

  // sessions
  sessionsData$ = this.store.pipe(select(s.selectSessionsData));
  sessionsLoading$ = this.store.pipe(select(s.selectSessionsLoading));
  sessionsLoaded$ = this.store.pipe(select(s.selectSessionsLoaded));
  sessionsError$ = this.store.pipe(select(s.selectSessionsError));

  emailCreateLoading$ = this.store.pipe(select(s.selectEmailCreateLoading));
  emailCreateError$ = this.store.pipe(select(s.selectEmailCreateError));

  emailDeleteLoading$ = this.store.pipe(select(s.selectEmailDeleteLoading));
  emailDeleteError$ = this.store.pipe(select(s.selectEmailDeleteError));

  // clients
  clientsData$ = this.store.pipe(select(s.selectClientsData));
  clientsLoading$ = this.store.pipe(select(s.selectClientsLoading));
  clientsLoaded$ = this.store.pipe(select(s.selectClientsLoaded));
  clientsError$ = this.store.pipe(select(s.selectClientsError));

  clientCreateLoading$ = this.store.pipe(select(s.selectClientCreateLoading));
  clientCreateError$ = this.store.pipe(select(s.selectClientCreateError));

  clientViewData$ = this.store.pipe(select(s.selectClientViewData));
  clientViewLoading$ = this.store.pipe(select(s.selectClientViewLoading));
  clientViewError$ = this.store.pipe(select(s.selectClientViewError));

  // mfa
  mfaData$ = this.store.pipe(select(s.selectMfaData));
  mfaLoading$ = this.store.pipe(select(s.selectMfaLoading));
  mfaError$ = this.store.pipe(select(s.selectMfaError));

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
  ) { }

  fetchMe() {
    this.store.dispatch(a.accountMeRequest());
  }

  fetchSessions() {
    this.store.dispatch(a.accountSessionsRequest());
  }

  deleteSession(uuid: string) {
    return this.http.delete<any>(`${environment.api}/v1/me/sessions/${uuid}`, { withCredentials: true });
  }

  createEmail(email: string) {
    this.store.dispatch(a.accountEmailsCreateRequest({ email }));
  }

  deleteEmail(uuid: string) {
    this.store.dispatch(a.accountEmailsDeleteRequest({ uuid }));
  }

  fetchClients() {
    this.store.dispatch(a.accountClientsRequest());
  }

  createClient(data) {
    this.store.dispatch(a.accountClientsCreateRequest({ data }));
  }

  fetchClient(client_id: string) {
    this.store.dispatch(a.accountClientFetchRequest({ client_id }));
  }

  mfaInitFlow(flow: "otp") {
    this.store.dispatch(a.accountMfaInitFlowRequest({ flow }));
  }

  mfaFinishFlow(code: string) {
    this.store.dispatch(a.accountMfaFinishFlowRequest({ code }));
  }

  mfaDisable(mfa_type: string) {
    this.store.dispatch(a.accountMfaDisableRequest({ mfa_type }));
  }
}
