import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccountGroup } from '@core/interfaces/IAccount';
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

  getAccount(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiUrl}/v1/admin/accounts/${uuid}`)
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

  getAccountOverview(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiUrl}/v1/admin/accounts/${uuid}/overview`)
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

  getAccountGroups(uuid: string): Promise<IAccountGroup[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IAccountGroup[]>(`${this.apiUrl}/v1/admin/accounts/${uuid}/groups`)
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

  getGroup(uuid: string): Promise<IAccountGroup> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IAccountGroup>(`${this.apiUrl}/v1/admin/groups/${uuid}`)
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

  getGroupMembers(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`${this.apiUrl}/v1/admin/groups/${uuid}/members`)
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

  getOrganization(uuid: string): Promise<IOrganization> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOrganization>(`${this.apiUrl}/v1/admin/organizations/${uuid}`)
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

  getOrganizationOverview(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`${this.apiUrl}/v1/admin/organizations/${uuid}/overview`)
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

  getOrganizationApps(uuid: string): Promise<IOAuth2Client[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IOAuth2Client[]>(`${this.apiUrl}/v1/admin/organizations/${uuid}/apps`)
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

  getOrganizationMembers(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`${this.apiUrl}/v1/admin/organizations/${uuid}/members`)
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

  getOrganizationInvitations(uuid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(`${this.apiUrl}/v1/admin/organizations/${uuid}/invitations`)
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
