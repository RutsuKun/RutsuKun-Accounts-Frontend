import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { MenuItem } from "primeng/api";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthService } from "./../../services/auth.service";


@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.scss"],
})
export class AdminPageComponent implements OnInit {
  private uns$ = new Subject();
  public session$ = this.authFacade.session$;

  menu: MenuItem[] = [
    {
      label: 'Dashboard',
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
          routerLink: "/admin/dashboard"
        },
        {
          label: "Accounts",
          icon: "pi pi-users",
          routerLink: "/admin/accounts"
        },
        {
          label: "Sessions",
          icon: "pi pi-database",
          routerLink: "/admin/accounts/sessions"
        },
        {
          label: "Settings",
          icon: "pi pi-cog",
          routerLink: "/admin/settings"
        }
      ],
    },
    {
      label: "OAuth2",
      items: [
        {
          label: "Apps",
          icon: "pi pi-table",
          routerLink: "/admin/apps"
        },
        {
          label: "Scopes",
          icon: "pi pi-lock",
          routerLink: "/admin/oauth/scopes"
        },
        {
          label: "Groups",
          icon: "pi pi-check-square",
          routerLink: "/admin/oauth/groups"
        }
      ]
    }
  ];

  constructor(
    private authFacade: AuthFacade,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authFacade.fetchSessions();
  }

  logoutLocal() {
    this.auth.logoutLocal();
  }

  logoutSession() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
