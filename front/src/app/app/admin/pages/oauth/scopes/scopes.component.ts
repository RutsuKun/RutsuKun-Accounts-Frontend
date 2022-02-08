import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdminCreateScopeDialogComponent } from "@app/admin/components/create-scope-dialog/create-scope-dialog.component";
import { AdminApiService } from "@app/admin/services/admin-api.service";
import { IOAuth2Scope } from "@core/interfaces/IOAuth2Scope";
import { MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  templateUrl: "./scopes.component.html",
  styleUrls: ["./scopes.component.scss"],
})
export class AdminOAuthScopesComponent implements OnInit {
  scopes: IOAuth2Scope[] = [];

  constructor(
    private api: AdminApiService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchScopes();
  }

  fetchScopes() {
    this.api
      .getScopes()
      .then((scopes) => {
        this.scopes = scopes;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getDefaultScopes() {
    return this.scopes.filter((s) => !!s.default);
  }

  getRestScopes() {
    return this.scopes.filter((s) => !s.default);
  }

  openCreateScopeDialog() {
    this.dialog
      .open(AdminCreateScopeDialogComponent, {
        header: "Create scope",
        modal: true,
        dismissableMask: true,
        styleClass: "w-11 md:w-6 lg:w-3",
      })
      .onClose.subscribe(() => {
        this.fetchScopes();
      });
  }

  getScopeMenu(scope: IOAuth2Scope): MenuItem[] {
    return [
      {
        label: "View",
        icon: "pi pi-eye",
        command: () => {
          this.router.navigate(["admin", "oauth", "scopes", scope.name]);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          this.api.deleteScope(scope).then(() => {
            this.fetchScopes();
          });
        },
      },
    ];
  }
}
