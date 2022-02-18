import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AppState } from '../';
import * as a from './auth.actions';
import * as s from './auth.selectors';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  authSessionFetchRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSessionFetchRequest),
        switchMap(() =>
          this.http.get(`${environment.auth}/session`, { withCredentials: true }).pipe(
            map((res: any) => a.authSessionFetchSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>
              of(a.authSessionFetchFail({ error: res.error }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  authSessionEndRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSessionEndRequest),
        switchMap(() =>
          this.http.post(`${environment.auth}/session/end`, {}, { withCredentials: true }).pipe(
            map((res: any) => a.authSessionEndSuccess({ data: res })),
            catchError((res: HttpErrorResponse) => of(a.authSessionEndFail({ error: res.error })))
          )
        )
      ),
    { dispatch: true }
  );

  authSessionEndSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSessionEndSuccess),
        tap(()=>{
          this.authService.redirectToSignIn();
        })
      ),
    { dispatch: false }
  );

  authSigninRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSigninRequest),
        switchMap(({ data }) =>
          this.http.post(`${environment.auth}/signin`, data, { withCredentials: true }).pipe(
            map((res: any) => a.authSigninSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>
              of(a.authSigninFail({ error: res.error.error, errors: res.error.errors }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  authSignupRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSignupRequest),
        switchMap(({ data }) =>
          this.http.post(`${environment.auth}/signup`, data, { withCredentials: true }).pipe(
            map((res: any) => a.authSignupSuccess({ data: res })),
            catchError((data: HttpErrorResponse) => of(a.authSignupFail({ data: data.error })))
          )
        )
      ),
    { dispatch: true }
  );

  authReAuthRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authReAuthRequest),
        switchMap(({ data }) =>
          this.http.post(`${environment.auth}/reauth`, data, { withCredentials: true }).pipe(
            map((res: any) => a.authReAuthSuccess({ data: res })),
            catchError((error: HttpErrorResponse) =>
              of(a.authReAuthFail({ error: error.error }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  authAuthorizeRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authAuthorizeRequest),
        switchMap(({ consentGiven, scope }) =>
          this.http.post(`${environment.oauth}/authorize`, { consentGiven, scope }, { withCredentials: true }).pipe(
            map((res: any) => a.authAuthorizeSuccess({ data: res })),
            catchError((error: HttpErrorResponse) => of(a.authAuthorizeFail({ error: error.error })))
          )
        )
      ),
    { dispatch: true }
  );

  authCheckRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authCheckRequest),
        switchMap(({ flow }) =>
          this.http.post(`${environment.auth}`, { flow }, { withCredentials: true }).pipe(
            map((res: any) => a.authCheckSuccess({ data: res })),
            catchError((error: HttpErrorResponse) =>
              of(a.authCheckFail({ data: error.error }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  authMultifactor = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authMultifactorRequest),
        withLatestFrom(this.store.pipe(select(s.selectAuthMultifactor))),
        switchMap(([{ code }, { type, token }]) =>
          this.http.post(`${environment.auth}/multifactor`, { code, token }, { withCredentials: true }).pipe(
            map((res: any) => a.authMultifactorSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>
              of(a.authMultifactorFail({ error: res.error }))
            )
          )
        )
      ),
    { dispatch: true }
  );


  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authCheckSuccess, a.authSigninSuccess, a.authSignupSuccess,  a.authReAuthSuccess, a.authMultifactorSuccess, a.authAuthorizeSuccess, a.authCompleteConnectProviderSuccess),
        tap(({ data })=>{
          const type = data.type;

          switch (type) {
            case "auth":
            break;
            case "logged-in":
              this.route.queryParamMap.subscribe((params)=>{
                if(params.has('redirectTo')) {
                  this.router.navigate([params.get('redirectTo')]);
                } else if(params.has('sso')) {
                  const decodedUrl = atob(params.get('sso'));
                  return window.location.href = `${environment.api}${decodedUrl}`;
                } else {
                  this.router.navigate(["account"]);
                }
              })
            break;
            case "account_created":
              this.authService.redirectToSignIn();
            break;
            case "reauth":
            break;
            case "multifactor":
              this.authService.redirectToMultifactor();
            break;
            case "consent":
              this.authService.redirectToAuthorize();
            break;
            case "response":
              window.location.href = data.response.parameters.uri;
            break;
            case "error":
            break;
          }
        })
      ),
    { dispatch: false }
  );

  authSigninFail = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authSigninFail),
        tap(({ error })=>{
          console.log('error', error);
        })
      ),
    { dispatch: false }
  );

  authAppInfoRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authAppInfoRequest),
        switchMap(({ client_id }) =>
          this.http.get(`${environment.api}/v1/oauth2/clients/${client_id}/public`, { withCredentials: true }).pipe(
            map((res: any) => a.authAppInfoSuccess({ data: res })),
            catchError((res: HttpErrorResponse) =>
              of(a.authAppInfoFail({ error: res.error }))
            )
          )
        )
      ),
    { dispatch: true }
  );

  authCompleteConnectProviderRequest = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.authCompleteConnectProviderRequest),
        switchMap(({ email, code }) =>
          this.http.post(`${environment.auth}/providers/complete-connect`, { email, code }, { withCredentials: true }).pipe(
            map((res: any) => a.authCompleteConnectProviderSuccess({ data: res })),
            catchError((res: HttpErrorResponse) => of(a.authCompleteConnectProviderFail({ error: res.error })))
          )
        )
      ),
    { dispatch: true }
  );
}