import { Component } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-admin-layout",
  templateUrl: "admin.component.html",
  styleUrls: ["admin.component.scss"],
})
export class AdminLayoutComponent {
  userData$ = this.oidcService.userData$;

  constructor(private oidcService: OidcSecurityService) {}
}
