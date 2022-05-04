import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as a from './account.actions';
import * as s from './account.selectors';
import { environment } from '@env/environment';
import {  } from 'rxjs-compat/operator/withLatestFrom';
import { AppState } from '..';
import { select, Store } from '@ngrx/store';

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  accountMeRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountMeRequest),
        switchMap(() =>
          this.http.get(`${environment.api}/v1/me`, { withCredentials: true }).pipe(
            map((res: any) => a.accountMeSuccess({ data: res})),
            catchError((res: HttpErrorResponse) =>of(a.accountMeFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountSessionsRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountSessionsRequest),
        switchMap(() =>
          this.http.get(`${environment.api}/v1/me/sessions`, { withCredentials: true }).pipe(
            map((res: any) => a.accountSessionsSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>of(a.accountSessionsFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountProvidersRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountProvidersRequest),
        switchMap(() =>
          this.http.get(`${environment.api}/v1/me/providers`, { withCredentials: true }).pipe(
            map((res: any) => a.accountProvidersSuccess({ data: res})),
            catchError((res: HttpErrorResponse) =>of(a.accountProvidersFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountEmailsCreateRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountEmailsCreateRequest),
        switchMap(({ email }) =>
          this.http.post(`${environment.api}/v1/me/emails`, { email }, { withCredentials: true }).pipe(
            map((res: any) => a.accountEmailsCreateSuccess({ data: res})),
            catchError((res: HttpErrorResponse) =>of(a.accountEmailsCreateFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountEmailsDeleteRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountEmailsDeleteRequest),
        switchMap(({ uuid }) =>
          this.http.delete(`${environment.api}/v1/me/emails/${uuid}`,  { withCredentials: true }).pipe(
            map((res: any) => a.accountEmailsDeleteSuccess({ uuid })),
            catchError((res: HttpErrorResponse) =>of(a.accountEmailsDeleteFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountClientsRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountClientsRequest),
        switchMap(() =>
          this.http.get(`${environment.api}/v1/oauth2/clients`, { withCredentials: true }).pipe(
            map((res: any) => a.accountClientsSuccess({ data: res})),
            catchError((res: HttpErrorResponse) =>of(a.accountClientsFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );
  
  accountClientFetchRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountClientFetchRequest),
        switchMap(({ client_id }) =>
          this.http.get(`${environment.api}/v1/oauth2/clients/${client_id}`, { withCredentials: true }).pipe(
            map((res: any) => a.accountClientFetchSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>of(a.accountClientsFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountClientsCreateRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountClientsCreateRequest),
        switchMap(( { data } ) =>
          this.http.post(`${environment.api}/v1/oauth2/clients`, { ...data }, { withCredentials: true }).pipe(
            map((res: any) => a.accountClientsCreateSuccess({ data: res})),
            catchError((res: HttpErrorResponse) =>of(a.accountClientsCreateFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

  accountMfaInitFlowRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountMfaInitFlowRequest),
        switchMap(({ flow }) =>
          this.http.post(`${environment.api}/v1/me/authn/${flow}/init-flow`, {}, { withCredentials: true }).pipe(
            map((res: any) => a.accountMfaInitFlowSuccess({ data: { ...res, type: flow}})),
            catchError((res: HttpErrorResponse) =>
              of(a.accountMfaInitFlowFail({ error: res.error.message }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  accountMfaFinishFlowRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountMfaFinishFlowRequest),
        withLatestFrom(this.store.pipe(select(s.selectMfaData))),
        switchMap(([{ code }, mfa]) =>
          this.http.put(`${environment.api}/v1/me/authn/${mfa.type}/finish-flow`, { code }, { withCredentials: true }).pipe(
            map((res: any) => a.accountMfaFinishFlowSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>
              of(a.accountMfaFinishFlowFail({ error: res.error.message }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  accountMfaDisableRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.accountMfaDisableRequest),
        switchMap(({ mfa_type }) =>
          this.http.delete(`${environment.api}/v1/me/authn/${mfa_type}/disable`, { withCredentials: true }).pipe(
            map((res: any) => a.accountMfaDisableSuccess({ data: ''})),
            catchError((res: HttpErrorResponse) => of(a.accountMfaDisableFail({ error: res.error.message })))
          )
        )
      ),
    { dispatch: true }
  );

}