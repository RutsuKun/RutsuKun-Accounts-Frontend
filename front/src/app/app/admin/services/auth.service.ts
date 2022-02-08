import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import {
  OidcClientNotification,
  OidcSecurityService,
} from "angular-auth-oidc-client";
import { Observable, Subject } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$ = this.oidcSecurityService.userData$;
  isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;

  error$: Subject<string> = new Subject();

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private checkAuth() {
    this.oidcSecurityService.checkAuth().subscribe();
  }

  public authorize() {

    this.oidcSecurityService.authorize('default', {
      customParams: {
        acr_values: "urn:rutsukun:bronze"
      }
    });
    return;
    try {
      this.oidcSecurityService
      .authorizeWithPopUp(
        {
          customParams: {
            display: "popup",
            service: "admin-portal"
          },
        },
        {
          width: 700,
          height: window.innerHeight - 100,
        },
        "default"
      )
      .subscribe((data) => {
        console.log('data', data);
        
        if (data.isAuthenticated) {

          const checkScopes: string[] =  this.oidcSecurityService.getAuthenticationResult('default').scope.split(" ");
          const neededScopes =  environment.admin_portal_scopes.split(" ");
          const authorized = neededScopes.every((scope) => checkScopes.includes(scope));

          console.log('checkScopes', checkScopes);
          console.log('neededScopes', neededScopes);
          console.log('authorized', authorized);
          
          if(!authorized) {
            this.oidcSecurityService.logoffLocal();
            this.error$.next('Admin portal access denied by authorization server');
            setTimeout(()=>{
              this.error$.next(null);
            }, 2000)
            this.router.navigate(['admin', 'signin']);
            return;
          }

          this.router.navigate(["admin", "dashboard"]);
        } else {
          this.oidcSecurityService.logoffLocal();
        }
      }, (error)=>{
        console.log('popup error', error);
      })
    } catch (error) {
      console.log('popup error', error);
      
    }

  }

  public logout() {
    this.oidcSecurityService.logoff();
  }

  public logoutLocal() {
    console.log("start logoffLocal");
    try {
      this.oidcSecurityService.logoffLocal();
      this.router.navigate(["/admin"]);
    } catch (error) {
      console.log(error);
    }
  }
}
