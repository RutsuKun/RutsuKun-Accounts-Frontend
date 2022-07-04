import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public oidcSecurityService: OidcSecurityService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.oidcSecurityService.getAccessToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    
    return next.handle(request);
  }
}
