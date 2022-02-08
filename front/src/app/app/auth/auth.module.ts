import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { AuthComponent } from "./auth.component";
import { AuthRoutes } from "./auth.routing";
import { ChartistModule } from "ng-chartist";
import {
  SignInComponent,
  //SignInAsDialog
} from "./pages/signin/signin.component";
import { SignUpComponent } from "./pages/signup/signup.component";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "@shared/shared.module";
import { CallbackComponent } from "./pages/callback/callback.component";
import { NotfoundComponent } from "./../notfound/notfound.component";

// components

import { SignInCardComponent } from "./components/signin-card/signin-card.component";
import { SignUpCardComponent } from "./components/signup-card/signup-card.component";
import { ForgotPasswordCardComponent } from "./components/forgot-password-card/forgot-password-card.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { AuthorizeCardComponent } from "./components/authorize-card/authorize-card.component";
import { AuthorizeComponent } from "./pages/authorize/authorize.component";
import { AuthHeaderComponent } from "./components/auth-header/auth-header.component";
import { CallbackDebugComponent } from "./pages/callback-debug/callback-debug.component";
import { OAuth2DeviceCodeComponent } from "./pages/device-code/device-code.component";
import { MultifactorComponent } from './pages/multifactor/multifactor.component';
import { AuthMultifactorCardComponent } from "./components/multifactor-card/multifactor-card.component";

@NgModule({
  imports: [
    RouterModule.forChild(AuthRoutes),
    SharedModule,
  ],
  declarations: [
    AuthComponent,
    AuthHeaderComponent,
    AuthComponent,
    OAuth2DeviceCodeComponent,
    SignInComponent,
    SignInCardComponent,
    SignUpComponent,
    SignUpCardComponent,
    ForgotPasswordComponent,
    ForgotPasswordCardComponent,
    AuthorizeComponent,
    AuthorizeCardComponent,
    CallbackComponent,
    CallbackDebugComponent,
    NotfoundComponent,
    AuthMultifactorCardComponent,
    MultifactorComponent,
  ],
})
export class AuthModule {}
