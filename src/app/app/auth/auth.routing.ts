import { Routes } from "@angular/router";

import { AuthComponent } from "./auth.component";
import { SignInComponent } from "./pages/signin/signin.component";
import { CallbackComponent } from "./pages/callback/callback.component";
import { SignUpComponent } from "./pages/signup/signup.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { AuthorizeComponent } from "./pages/authorize/authorize.component";
import { CallbackDebugComponent } from "./pages/callback-debug/callback-debug.component";
import { OAuth2DeviceCodeComponent } from "./pages/device-code/device-code.component";
import { MultifactorComponent } from "./pages/multifactor/multifactor.component";
import { CompleteSignUpComponent } from "./pages/complete-signup/complete-signup.component";
import { ChooseAccountComponent } from "./pages/choose-account/choose-account.component";

export const AuthRoutes: Routes = [
  {
    path: "",
    redirectTo: "signin",
  },
  {
    path: "device",
    redirectTo: "oauth2/device-code",
  },
  {
    path: "signin",
    component: SignInComponent,
    data: {
      title: "signin",
    },
  },
  {
    path: "choose-account",
    component: ChooseAccountComponent,
    data: {
      title: "choose-account",
    },
  },
  {
    path: "signup",
    component: SignUpComponent,
    data: {
      title: "signup",
    },
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    data: {
      title: "pages.forgot-password.title",
    },
  },
  {
    path: "multifactor",
    component: MultifactorComponent,
    data: {
      title: "Multifactor",
    },
  },
  {
    path: "complete-signup",
    component: CompleteSignUpComponent,
    data: {
      title: "complete-signup",
    },
  },
  {
    path: "oauth2",
    children: [
      {
        path: "authorize",
        component: AuthorizeComponent,
        data: {
          title: "pages.authorize.title",
        },
      },
      {
        path: "device-code",
        component: OAuth2DeviceCodeComponent,
        data: {
          title: "pages.device-code.title",
        },
      },
    ],
  },
  {
    path: "callback",
    component: CallbackComponent,
  },
  {
    path: "debug",
    component: CallbackDebugComponent,
  }
];
