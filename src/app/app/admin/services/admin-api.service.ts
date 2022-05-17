import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOAuth2Client } from '@core/interfaces/IOAuth2Client';
import { IOAuth2Scope } from '@core/interfaces/IOAuth2Scope';
import { IOrganization } from '@core/interfaces/IOrganization';
import { environment } from '@env/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  apiUrl = environment.api;
  constructor(private http: HttpClient) { }

  getAccounts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiUrl}/v1/admin/accounts`)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  getGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiUrl}/v1/admin/groups`)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  getApps(): Promise<IOAuth2Client[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOAuth2Client[]>(`${this.apiUrl}/v1/admin/clients`)
        .pipe(
          catchError((err) => {
            resolve(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  getOrganizations(): Promise<IOrganization[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOrganization[]>(`${this.apiUrl}/v1/admin/organizations`)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  getApp(client_id: string): Promise<IOAuth2Client> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOAuth2Client>(`${this.apiUrl}/v1/admin/clients/${client_id}`)
        .pipe(
          catchError((err) => {
            resolve(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  createApp(client: IOAuth2Client): Promise<IOAuth2Client> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IOAuth2Client>(`${this.apiUrl}/v1/admin/clients`, client)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  getScopes(): Promise<IOAuth2Scope[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOAuth2Scope[]>(`${this.apiUrl}/v1/admin/scopes`)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  createScope(scope: IOAuth2Scope): Promise<IOAuth2Scope> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IOAuth2Scope>(`${this.apiUrl}/v1/admin/scopes`, scope)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  deleteScope(scope: IOAuth2Scope): Promise<IOAuth2Scope> {
    return new Promise((resolve, reject) => {
      this.http
        .delete<IOAuth2Scope>(`${this.apiUrl}/v1/admin/scopes/${scope.name}`)
        .pipe(
          catchError((err) => {
            reject(err.error);
            return throwError(err);
          })
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

}
