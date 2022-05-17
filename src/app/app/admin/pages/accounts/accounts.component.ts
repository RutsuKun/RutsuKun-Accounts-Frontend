import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdminApiService } from "@app/admin/services/admin-api.service";
import { IAccount } from "@core/interfaces/IAccount";
import { MenuItem } from "primeng/api";

@Component({
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"],
})
export class AdminAccountsComponent implements OnInit {
  accounts: IAccount[] = [];
  roles: any[];
  states: any[];
  loading = false;

  constructor(
    private router: Router,
    private api: AdminApiService
  ) {}

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

  getPrimaryEmail(account: IAccount) {
    return account.emails.find((email) => email.primary).email || "(empty)";
  }

  generateAccountMenu(account: IAccount): MenuItem[] {
    return [
      {
        label: "View Details",
        command: () => this.router.navigate(["/admin/accounts/", account.uuid]),
      },
      {
        separator: true,
      },
      {
        label: "Assign Groups",
        command: () => {},
        icon: "pi pi-check-square",
      },
      {
        label: "Assign Permissions",
        command: () => {},
        icon: "pi pi-check-square",
      },
      {
        label: "Send Verification Email",
        command: () => {},
        icon: "pi pi-envelope",
      },
      {
        separator: true,
      },
      {
        label: "Change Email",
        command: () => {},
      },
      {
        label: "Change Password",
        command: () => {},
      },
      {
        separator: true,
      },
      {
        label: "Block",
        command: () => {},
        icon: "pi pi-times-circle",
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {},
        styleClass: "danger"
      },
    ];
  }
}
