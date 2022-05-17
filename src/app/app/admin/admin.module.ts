import { NgModule, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AdminRoutes } from "./admin.routing";
import { SharedModule } from "@shared/shared.module";
import { AdminSignInComponent } from "./pages/signin/signin.component";
import { AuthService } from "./services/auth.service";
import { CallbackComponent } from "./pages/callback/callback.component";

import { AdminDashboardComponent } from "./pages/dashboard/dashboard.component";
import { AdminPageComponent } from "./components/admin-page-layout/admin-page.component";

// ADMIN ACCOUNTS
import { AdminAccountsComponent } from "./pages/accounts/accounts.component";
import { AdminAccountsCreateComponent } from "./pages/accounts/create-account/create-account.component";
import { AdminAccountsSessionsComponent } from "./pages/accounts/sessions/sessions.component";

// ADMIN APPS
import { AdminAppsComponent } from "./pages/apps/apps.component";
import { AdminAppsCreateComponent } from "./pages/apps/create-app/create-app.component";
import { AdminCreateAppDialogComponent } from './components/create-app-dialog/create-app-dialog.component';

// ADMIN OAUTH
import { AdminOAuthComponent } from "./pages/oauth/oauth.component";
import { AdminOAuthScopesComponent } from "./pages/oauth/scopes/scopes.component";
import { AdminOAuthScopesViewComponent } from './pages/oauth/scopes/view/view.component';
import { AdminCreateScopeDialogComponent } from './components/create-scope-dialog/create-scope-dialog.component';
import { AdminOAuthGroupsComponent } from "./pages/oauth/groups/groups.component";

// ADMIN SETTINGS
import { AdminSettingsComponent } from './pages/settings/settings.component';

import { NgApexchartsModule } from "ng-apexcharts";
import { ChartCardComponent } from "./components/chart-card/chart-card.component";
import { AdminApiService } from "./services/admin-api.service";
import { DialogService } from "primeng/dynamicdialog";
import { AdminAppsSettingsComponent } from './pages/apps/settings/settings.component';
import { AdminOrganizationsComponent } from './pages/organizations/organizations.component';
import { AdminOrganizationViewComponent } from './pages/organizations/organization-view/organization-view.component';
import { AdminOrganizationOverviewComponent } from './pages/organizations/organization-overview/organization-overview.component';
import { AdminOrganizationMembersComponent } from './pages/organizations/organization-members/organization-members.component';
import { AdminOrganizationInvitationsComponent } from './pages/organizations/organization-invitations/organization-invitations.component';



@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutes),
    SharedModule,
    NgApexchartsModule,
  ],
  providers: [
    AuthService,
    AdminApiService,
    DialogService
  ],
  declarations: [
    AdminPageComponent,
    AdminSignInComponent,
    AdminDashboardComponent,
    CallbackComponent,
    ChartCardComponent,

    AdminAccountsComponent,
    AdminAppsComponent,
    AdminAppsCreateComponent,
    AdminAppsSettingsComponent,
    AdminOAuthComponent,
    AdminOAuthScopesComponent,
    AdminOAuthScopesViewComponent,
    AdminOAuthGroupsComponent,
    AdminAccountsCreateComponent,
    AdminAccountsSessionsComponent,
    AdminSettingsComponent,
    AdminCreateScopeDialogComponent,
    AdminCreateAppDialogComponent,
    AdminOrganizationsComponent,
    AdminOrganizationViewComponent,
    AdminOrganizationOverviewComponent,
    AdminOrganizationMembersComponent,
    AdminOrganizationInvitationsComponent,

  ],
})
export class AdminModule implements OnDestroy {
  ngOnDestroy() {}
}
