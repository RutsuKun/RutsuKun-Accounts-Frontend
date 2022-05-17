import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSidebarComponent implements OnInit {
  navigation: MenuItem[] = [
    {
      label: "Dashboard",
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
          routerLink: "/admin/dashboard",
        },
        {
          label: "Accounts",
          icon: "pi pi-users",
          routerLink: "/admin/accounts",
        },
        {
          label: "Organizations",
          icon: "pi pi-building",
          routerLink: "/admin/organizations",
        },
        {
          label: "Sessions",
          icon: "pi pi-database",
          routerLink: "/admin/accounts/sessions",
          disabled: true
        },
        {
          label: "Settings",
          icon: "pi pi-cog",
          routerLink: "/admin/settings",
        },
      ],
    },
    {
      label: "OAuth2",
      items: [
        {
          label: "Apps",
          icon: "pi pi-table",
          routerLink: "/admin/apps",
        },
        {
          label: "Scopes",
          icon: "pi pi-lock",
          routerLink: "/admin/oauth/scopes",
        },
        {
          label: "Groups",
          icon: "pi pi-check-square",
          routerLink: "/admin/oauth/groups",
        },
      ],
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
