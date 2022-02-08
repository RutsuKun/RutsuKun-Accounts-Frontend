import { Routes } from "@angular/router";
import { AccountAppsComponent } from "./pages/apps/account-apps.component";
import { AccountAppsCreateComponent } from "./pages/apps/create-app/account-apps-create.component";
import { AccountAppsViewComponent } from "./pages/apps/view-app/view-app.component";
import { AccountGeneralComponent } from "./pages/general/account-general.component";
import { AccountSessionsComponent } from "./pages/sessions/account-sessions.component";

export const AccountRoutes: Routes = [
  {
    path: "",
    redirectTo: "general",
  },
  {
    path: "general",
    component: AccountGeneralComponent,
    data: {
      title: "account-general",
    },
  },
  {
    path: "apps",
    children: [
      {
        path: "",
        component: AccountAppsComponent,
        data: {
          title: "account-apps",
        },
      },
      {
        path: "create",
        component: AccountAppsCreateComponent,
        data: {
          title: "account-create-app",
        },
      },
      {
        path: ":client_id",
        component: AccountAppsViewComponent,
        data: {
          title: "account-view-app",
        },
      },
    ],
  },
  {
    path: "sessions",
    component: AccountSessionsComponent,
    data: {
      title: "account-sessions",
    },
  },
];
