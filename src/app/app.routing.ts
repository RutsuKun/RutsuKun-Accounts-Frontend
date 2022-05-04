import { Routes, CanActivate } from "@angular/router";
import { MainComponent } from "./shared/layouts/main/main.component";
import { NotfoundComponent } from "./app/notfound/notfound.component";
import { AuthComponent } from "./app/auth/auth.component";
import { AdminLayoutComponent } from "@shared/layouts/admin/admin.component";

export const AppRoutes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./app/auth/auth.module").then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: "account",
    component: MainComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./app/account/account.module").then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: "admin",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./app/admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: "**",
    component: AuthComponent,
    children: [
      {
        path: "",
        component: NotfoundComponent,
      },
    ],
  },
];
