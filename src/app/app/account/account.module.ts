import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@shared/shared.module";
import { AccountRoutes } from "./account.routing";

// components
import { AccountGeneralComponent } from "./pages/general/account-general.component";
import { AccountComponent } from "./components/account/account.component";
import { AccountSessionsComponent } from "./pages/sessions/account-sessions.component";

import { AccountAppsComponent } from "./pages/apps/account-apps.component";
import { AccountAppsCreateComponent } from "./pages/apps/create-app/account-apps-create.component";
import { AccountAppsViewComponent } from './pages/apps/view-app/view-app.component';

import { AddSecondaryEmailDialogComponent } from './components/add-secondary-email-dialog/add-secondary-email-dialog.component';
import { SetupMfaDialogComponent } from './components/setup-mfa-dialog/setup-mfa-dialog.component';
import { AccountConnectionsComponent } from './pages/connections/connections.component';


@NgModule({
  imports: [RouterModule.forChild(AccountRoutes), SharedModule],
  declarations: [
    AccountComponent,
    AccountGeneralComponent,
    AccountAppsComponent,
    AccountAppsCreateComponent,
    AccountAppsViewComponent,
    AccountSessionsComponent,
    AccountConnectionsComponent,
    AddSecondaryEmailDialogComponent,
    SetupMfaDialogComponent
  ],
})
export class AuthModule {}
