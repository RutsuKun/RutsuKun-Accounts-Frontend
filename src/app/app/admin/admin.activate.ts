import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable()
export class AdminActivate implements CanActivate, CanDeactivate<any> {
  constructor() {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if(state.url.includes('/admin/signin')) {
      document.body.classList.add("admin-portal");
    }
    return true;
  }

  public canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    console.log('aaabbbccc', currentState);
    
    if(currentState.url.includes('/admin/signin')) {
      document.body.classList.remove("admin-portal");
    }
    return true;
  }
}
