import { Routes } from "@angular/router";
import { AdminActivate } from "./admin.activate";
import { AuthGuard } from "./guards/auth/auth.guard";
import { CheckLoggedGuard } from "./guards/check-logged/check-logged.guard";
import { AdminAccountsComponent } from "./pages/accounts/accounts.component";
import { AdminAccountsCreateComponent } from "./pages/accounts/create-account/create-account.component";
import { AdminAccountsSessionsComponent } from "./pages/accounts/sessions/sessions.component";
import { AdminAppsComponent } from "./pages/apps/apps.component";
import { AdminAppsCreateComponent } from "./pages/apps/create-app/create-app.component";
import { AdminAppsSettingsComponent } from "./pages/apps/settings/settings.component";
import { CallbackComponent } from "./pages/callback/callback.component";
import { AdminDashboardComponent } from "./pages/dashboard/dashboard.component";
import { AdminOAuthGroupsComponent } from "./pages/oauth/groups/groups.component";
import { AdminOAuthComponent } from "./pages/oauth/oauth.component";
import { AdminOAuthScopesComponent } from "./pages/oauth/scopes/scopes.component";
import { AdminOAuthScopesViewComponent } from "./pages/oauth/scopes/view/view.component";
import { AdminSettingsComponent } from "./pages/settings/settings.component";
import { AdminSignInComponent } from "./pages/signin/signin.component";

export const AdminRoutes: Routes = [
  {
    path: "",
    canActivate: [CheckLoggedGuard],
  },
  {
    path: "signin",
    component: AdminSignInComponent,
    canActivate: [AdminActivate, CheckLoggedGuard],
    canDeactivate: [AdminActivate],
    data: {
      title: "Signin - Admin Portal"
    }
  },
  {
    path: "dashboard",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Dashboard",
    },
  },
  {
    path: "accounts",
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: AdminAccountsComponent,
        data: {
          title: "Accounts",
        },
      },
      {
        path: "create",
        component: AdminAccountsCreateComponent,
        data: {
          title: "Create account",
        },
      },
      {
        path: "sessions",
        component: AdminAccountsSessionsComponent,
        data: {
          title: "Sessions",
        },
      },
    ],
  },
  {
    path: "apps",
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: AdminAppsComponent,
        data: {
          title: "Apps",
        },
      },
      {
        path: ":client_id/settings",
        component: AdminAppsSettingsComponent,
        data: {
          title: "App Settings",
        },
      },
      {
        path: "create",
        component: AdminAppsCreateComponent,
        data: {
          title: "Create app",
        },
      },
    ],
  },
  {
    path: "oauth",
    canActivate: [AuthGuard],
    data: {
      title: "OAuth",
    },
    children: [
      {
        path: "",
        component: AdminOAuthComponent,
      },
      {
        path: "scopes",
        children: [
          {
            path: "",
            component: AdminOAuthScopesComponent,
            data: {
              title: "OAuth Scopes",
            },
          },
          {
            path: ":scope",
            component: AdminOAuthScopesViewComponent,
            data: {
              title: "OAuth Scope",
            },
          }
        ]
      },
      {
        path: "groups",
        component: AdminOAuthGroupsComponent,
        data: {
          title: "OAuth Groups",
        },
      },
    ],
  },
  {
    path: "settings",
    component: AdminSettingsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Settings",
    },
  },
  {
    path: "signin/callback",
    component: CallbackComponent,
  },
];
