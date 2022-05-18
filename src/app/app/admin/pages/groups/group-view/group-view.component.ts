import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { IAccountGroup } from '@core/interfaces/IAccount';
import { MenuItem } from 'primeng/api';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class AdminGroupViewComponent implements OnInit {
  group: IAccountGroup = null;

  tabs: MenuItem[] = [];

  activeTab = null;

  constructor(
    private api: AdminApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.generateTabs();
    this.subscribeRouteChange();
  }

  generateTabs() {
    this.activatedRoute.paramMap.subscribe((params) => {
        this.fetchGroup(params.get("uuid"));
        this.tabs = [
          {
            id: "overview",
            label: "Overview",
            command: () => this.router.navigate(["/admin/groups/", params.get("uuid"), "overview"]),
          },
          {
            id: "members",
            label: "Members",
            command: () => this.router.navigate(["/admin/groups/", params.get("uuid"), "members"])
          },
          {
            id: "permissions",
            label: "Permissions",
            command: () => this.router.navigate(["/admin/groups/", params.get("uuid"), "permissions"]),
            disabled: true
          },
        ];

        this.setCurrentTab();

      });
  }

  setCurrentTab() {
    this.activatedRoute.children[0].data.pipe(take(1)).subscribe((data) => {
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

  fetchGroup(uuid: string) {
    this.api.getGroup(uuid).then((group) => {
      this.group = group;
    }).catch((err) => {
      alert(err.error)
    })
  }
}
