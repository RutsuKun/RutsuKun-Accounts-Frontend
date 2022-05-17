import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { withLatestFrom } from "rxjs/operators";

@Component({
  templateUrl: "./organization-view.component.html",
  styleUrls: ["./organization-view.component.scss"],
})
export class AdminOrganizationViewComponent implements OnInit {
  tabs: MenuItem[] = [];

  activeTab = this.tabs[0];

  constructor(private router: Router, private activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.generateTabs();
  }

  generateTabs() {
    this.activateRoute.paramMap
      .pipe(withLatestFrom(this.activateRoute.children[0].data))
      .subscribe(([params, data]) => {
        
        
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

        console.log('data ', data);
        this.activeTab = this.tabs.find((tab) => tab.id === data.tab);

      });
  }
}
