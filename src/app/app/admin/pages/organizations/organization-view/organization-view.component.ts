import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { take, withLatestFrom } from "rxjs/operators";

@Component({
  templateUrl: "./organization-view.component.html",
  styleUrls: ["./organization-view.component.scss"],
})
export class AdminOrganizationViewComponent implements OnInit {
  tabs: MenuItem[] = [];

  activeTab = this.tabs[0];

  constructor(private router: Router, private activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('ngOnInit');
    
    this.generateTabs();
    this.subscribeRouteChange();
  }

  generateTabs() {
    console.log('generateTabs');
    
    this.activateRoute.paramMap
      .subscribe((params) => {
        
        
        this.tabs = [
          {
            id: "overview",
            label: "Overview",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "overview"]),
          },
          {
            id: "members",
            label: "Members",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "members"])
          },
          {
            id: "invitations",
            label: "Invitations",
            command: () => this.router.navigate(["/admin/organizations/", params.get("uuid"), "invitations"])
          },
        ];

        this.setCurrentTab();

      });
  }

  setCurrentTab() {
    console.log('setCurrentTab');
    this.activateRoute.children[0].data.pipe(take(1)).subscribe((data) => {
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
}
