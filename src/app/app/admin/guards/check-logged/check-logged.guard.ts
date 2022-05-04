import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { from, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CheckLoggedGuard implements CanActivate {
  constructor(private oidc: OidcSecurityService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(this.oidc.checkAuth()).pipe(
      map(({ isAuthenticated }) => {
        if (isAuthenticated) {
          this.router.navigate(["admin", "dashboard"]);
          return false;
        } else if(!state.url.includes('/admin/signin')) {
          this.router.navigate(["admin", "signin"]);
          return false;
        }
        return true;
      })
    );
  }
}
