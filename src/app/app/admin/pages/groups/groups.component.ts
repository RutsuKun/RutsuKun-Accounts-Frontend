import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdminApiService } from "@app/admin/services/admin-api.service";
import { IAccountGroup } from "@core/interfaces/IAccount";
import { MenuItem } from "primeng/api";


@Component({
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
})
export class AdminGroupsComponent implements OnInit {
  groups = [];

  constructor(
    private api: AdminApiService,
    private router: Router
  ) {}

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

  generateGroupMenu(group: IAccountGroup): MenuItem[] {
    return [
      {
        label: "View Details",
        command: () => this.router.navigate(["/admin/groups/", group.uuid, "overview"]),
      },
      {
        label: "Members",
        command: () => this.router.navigate(["/admin/groups/", group.uuid, "members"]),
        disabled: true
      },
      {
        label: "Permissions",
        command: () => this.router.navigate(["/admin/groups/", group.uuid, "permissions"]),
        disabled: true
      },
      {
        separator: true,
      },
      {
        label: "Delete Group",
        icon: "pi pi-trash",
        command: () => {},
        styleClass: "danger",
        disabled: true
      },
    ];
  }
}
