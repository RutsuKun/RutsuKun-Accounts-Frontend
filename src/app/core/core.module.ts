import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { AuthModule as OidcAuthModule, LogLevel } from "angular-auth-oidc-client";
import { AppRoutes } from "./../app.routing";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "@env/environment";
import { RecaptchaV3Module } from "ng-recaptcha";
import { EffectsModule } from "@ngrx/effects";

import { effects, facades, metaReducers, reducers } from "./store";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@Injectable()
export class LocalStorage {
  public read(key: string): any {
    return localStorage.getItem(key);
  }

  public write(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    RecaptchaV3Module,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    OidcAuthModule.forRoot({
      config: {
        configId: "default",
        authority: environment.api,
        redirectUrl: window.location.origin + "/admin/signin/callback",
        postLogoutRedirectUri: window.location.origin + "/admin",
        postLoginRoute: "/admin/dashboard",
        clientId: "admin-portal",
        scope: environment.admin_portal_scopes,
        responseType: "code",
        silentRenew: true,
        silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        logLevel: LogLevel.Debug,
        storage: new LocalStorage(),
        unauthorizedRoute: "/admin/signin?error=Admin portal access denied by authorization server",
        startCheckSession: false,
        useRefreshToken: false,
      },
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    EffectsModule.forRoot(effects),
  ],
  providers: [...facades],
  exports: [RouterModule, TranslateModule, CommonModule, StoreModule]
})
export class CoreModule {}
