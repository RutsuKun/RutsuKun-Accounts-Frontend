import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { MenuItem } from 'primeng/api';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AdminAccountViewComponent implements OnInit {
  account = null;

  tabs: MenuItem[] = [];

  activeTab = null;;

  constructor(
    private api: AdminApiService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.generateTabs();
    this.subscribeRouteChange();
  }

  generateTabs() {
    this.activateRoute.paramMap
      .subscribe((params) => {
        this.fetchAccount(params.get("uuid"));
        this.tabs = [
          {
            id: "details",
            label: "Details",
            command: () => this.router.navigate(["/admin/accounts/", params.get("uuid"), "details"]),
          },
          {
            id: "authorized-applications",
            label: "Authorized Applications",
            command: () => this.router.navigate(["/admin/accounts/", params.get("uuid"), "authorized-apps"]),
            disabled: true
          },
          {
            id: "permissions",
            label: "Permissions",
            command: () => this.router.navigate(["/admin/accounts/", params.get("uuid"), "permissions"]),
            disabled: true
          },
          {
            id: "groups",
            label: "Groups",
            command: () => this.router.navigate(["/admin/accounts/", params.get("uuid"), "groups"])
          },
        ];

        this.setCurrentTab();

      });
  }

  setCurrentTab() {
    this.activateRoute.children[0].data.pipe(take(1)).subscribe((data) => {
      this.activeTab = this.tabs.find((tab) => tab.id === data.tab);
    })
  }

  subscribeRouteChange() {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.setCurrentTab();
      }
    });
  }

  fetchAccount(uuid: string) {
    this.api.getAccount(uuid).then((account) => {
      this.account = account;
    })
  }
}
