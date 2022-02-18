import { Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import {
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { AppComponent } from "./app.component";


import { SharedModule } from "./shared/shared.module";



import { RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";


import { TokenInterceptor } from "@app/admin/token.interceptor";
import { AdminComponent } from "@app/admin/admin.component";
import { AppHeaderComponent } from "@shared/components/app-header/app-header.component";
import { MainComponent } from "@shared/layouts/main/main.component";
import { TitleService } from "@core/services/title.service";
import { AdminActivate } from "@app/admin/admin.activate";
import { AuthService } from "@core/services/auth.service";
import { CoreModule } from './core/core.module';
import { ThemeService } from "@core/services/theme.service";
import { AdminLayoutComponent } from "@shared/layouts/admin/admin.component";



@NgModule({
  imports: [
    SharedModule,
    CoreModule,
  ],
  declarations: [
    AppComponent,
    MainComponent,
    AdminLayoutComponent,
    AppHeaderComponent,
    AdminComponent,
  ],
  providers: [
    Title,
    AuthService,
    FormBuilder,
    TitleService,
    ThemeService,
    AdminActivate,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6Lfq3P0cAAAAADkyi5cBWelvgnM1ynnsRGCPQhp5",
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
