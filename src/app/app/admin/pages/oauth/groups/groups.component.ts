import { Component, OnInit } from "@angular/core";
import { AdminApiService } from "@app/admin/services/admin-api.service";


@Component({
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
})
export class AdminOAuthGroupsComponent implements OnInit {
  groups = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups() {
    this.api
      .getGroups()
      .then((groups) => {
        this.groups = groups;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}
