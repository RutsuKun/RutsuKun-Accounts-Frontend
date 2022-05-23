import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AdminApiService } from "@app/admin/services/admin-api.service";
import { IOrganization } from "@core/interfaces/IOrganization";
import { MenuItem } from "primeng/api";
import { take, withLatestFrom } from "rxjs/operators";

@Component({
  templateUrl: "./organization-view.component.html",
  styleUrls: ["./organization-view.component.scss"],
})
export class AdminOrganizationViewComponent implements OnInit {

  organization: IOrganization = null;

  tabs: MenuItem[] = [];

  activeTab = this.tabs[0];

  constructor(
    private api: AdminApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit');
    
    this.generateTabs();
    this.subscribeRouteChange();
  }

  generateTabs() {
    console.log('generateTabs');
    
    this.activatedRoute.paramMap.subscribe((params) => {
        this.fetchOrganization(params.get("uuid"));
        this.tabs = [
          {
            id: "overview",
            label: "Overview",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "overview"]),
          },
          {
            id: "apps",
            label: "Apps",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "apps"]),
          },
          {
            id: "members",
            label: "Members",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "members"])
          },
          {
            id: "groups",
            label: "Groups",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "groups"])
          },
          {
            id: "permissions",
            label: "Permissions",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "permissions"])
          },
          {
            id: "invitations",
            label: "Invitations",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "invitations"]),
            disabled: true
          },
        ];

        this.setCurrentTab();

      });
  }

  setCurrentTab() {
    console.log('setCurrentTab');
    this.activatedRoute.children[0].data.pipe(take(1)).subscribe((data) => {
      this.activeTab = this.tabs.find((tab) => tab.id === data.tab);
    })
  }

  subscribeRouteChange() {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        console.log('routeChanged');
        this.setCurrentTab();
      }
  });
  }

  fetchOrganization(uuid: string) {
    this.api.getOrganization(uuid).then((organization) => {
      this.organization = organization;
    })
  }
}
