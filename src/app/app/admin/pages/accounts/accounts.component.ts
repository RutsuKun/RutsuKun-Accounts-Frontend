import { Component, OnInit } from "@angular/core";
import { AdminApiService } from "@app/admin/services/admin-api.service";


@Component({
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"],
})
export class AdminAccountsComponent implements OnInit {
  accounts = [];
  roles: any[];
  states: any[];
  loading = false;

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.roles = [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
    ];
    this.states = [
      { label: "Enabled", value: "ENABLED" },
      { label: "Banned", value: "BANNED" },
      { label: "Delated", value: "DELATED" },
    ];
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.loading = true;
    this.api
      .getAccounts()
      .then((accounts) => {
        this.accounts = accounts;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }
}
