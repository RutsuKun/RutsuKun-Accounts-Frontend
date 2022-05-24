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
import { AdminAccountViewComponent } from './pages/accounts/account-view/account-view.component';
import { AdminAccountDetailsComponent } from './pages/accounts/account-view/tabs/account-details/account-details.component';
import { AdminAccountPermissionsComponent } from "./pages/accounts/account-view/tabs/account-permissions/account-permissions.component";
import { AdminAccountGroupsComponent } from './pages/accounts/account-view/tabs/account-groups/account-groups.component';

// ADMIN GROUPS
import { AdminGroupsComponent } from "./pages/groups/groups.component";
import { AdminGroupViewComponent } from './pages/groups/group-view/group-view.component';
import { AdminGroupOverviewComponent } from './pages/groups/group-view/tabs/group-overview/group-overview.component';
import { AdminGroupMembersComponent } from './pages/groups/group-view/tabs/group-members/group-members.component';

// ADMIN APPS
import { AdminAppsComponent } from "./pages/apps/apps.component";
import { AdminAppsCreateComponent } from "./pages/apps/create-app/create-app.component";
import { AdminCreateAppDialogComponent } from './components/create-app-dialog/create-app-dialog.component';
import { AdminAppsSettingsComponent } from './pages/apps/settings/settings.component';

// ADMIN OAUTH
import { AdminOAuthComponent } from "./pages/oauth/oauth.component";
import { AdminOAuthScopesComponent } from "./pages/oauth/scopes/scopes.component";
import { AdminOAuthScopesViewComponent } from './pages/oauth/scopes/view/view.component';
import { AdminCreateScopeDialogComponent } from './components/create-scope-dialog/create-scope-dialog.component';


// ADMIN SETTINGS
import { AdminSettingsComponent } from './pages/settings/settings.component';


// ADMIN ORGANIZATIONS
import { AdminOrganizationsComponent } from './pages/organizations/organizations.component';
import { AdminOrganizationViewComponent } from './pages/organizations/organization-view/organization-view.component';
import { AdminOrganizationOverviewComponent } from './pages/organizations/organization-view/tabs/organization-overview/organization-overview.component';
import { AdminOrganizationAppsComponent } from './pages/organizations/organization-view/tabs/organization-apps/organization-apps.component';
import { AdminOrganizationMembersComponent } from './pages/organizations/organization-view/tabs/organization-members/organization-members.component';
import { AdminOrganizationPermissionsComponent } from './pages/organizations/organization-view/tabs/organization-permissions/organization-permissions.component';
import { AdminOrganizationInvitationsComponent } from './pages/organizations/organization-view/tabs/organization-invitations/organization-invitations.component';
import { AdminOrganizationCreateDialogComponent } from './pages/organizations/organization-create-dialog/organization-create-dialog.component';

// OTHER
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartCardComponent } from "./components/chart-card/chart-card.component";
import { AdminApiService } from "./services/admin-api.service";
import { DialogService } from "primeng/dynamicdialog";



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


    // ACCOUNTS
    AdminAccountsComponent,
    AdminAccountViewComponent,
    AdminAccountDetailsComponent,
    AdminAccountPermissionsComponent,
    AdminAccountGroupsComponent,
    AdminAccountsCreateComponent,
    AdminAccountsSessionsComponent,

    // GROUPS
    AdminGroupsComponent,
    AdminGroupViewComponent,
    AdminGroupOverviewComponent,
    AdminGroupMembersComponent,

    // APPS
    AdminAppsComponent,
    AdminAppsCreateComponent,
    AdminAppsSettingsComponent,

    // OAUTH
    AdminOAuthComponent,
    AdminOAuthScopesComponent,
    AdminOAuthScopesViewComponent,

    AdminSettingsComponent,
    AdminCreateScopeDialogComponent,
    AdminCreateAppDialogComponent,

    // ORGANIZATIONS
    AdminOrganizationsComponent,
    AdminOrganizationViewComponent,
    AdminOrganizationOverviewComponent,
    AdminOrganizationAppsComponent,
    AdminOrganizationMembersComponent,
    AdminOrganizationPermissionsComponent,
    AdminOrganizationInvitationsComponent,
    AdminOrganizationCreateDialogComponent,
  ],
})
export class AdminModule implements OnDestroy {
  ngOnDestroy() {}
}
