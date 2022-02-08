import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { Clipboard } from "@angular/cdk/clipboard";
import { AccountFacade } from "@core/store/account/account.facade";

@Component({
  selector: "app-account-apps",
  templateUrl: "./account-apps.component.html",
  styleUrls: ["./account-apps.component.scss"],
})
export class AccountAppsComponent implements OnInit, OnDestroy {
  private uns$ = new Subject();

  apps$ = this.accountFacade.clientsData$;
  loading$ = this.accountFacade.clientsLoading$;

  types = [
    {
      name: "Web (Web Server App)",
      value: "wsa",
    },
    {
      name: "SPA (Single Page App)",
      value: "spa",
    },
    {
      name: "Native",
      value: "native",
    },
    {
      name: "Mobile",
      value: "mobile",
    },
  ];

  constructor(
    private accountFacade: AccountFacade,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.getApps();
  }

  getApps() {
    this.accountFacade.fetchClients();
  }

  debug(ev) {
    console.log(ev);
  }

  copyToClipboard(text: string) {
    this.clipboard.copy(text);
  }

  getAppTypeDescription(type) {
    return this.types.find((t) => t.value === type).name;
  }

  deleteApp(appId: string) {
    // this.api
    //   .deleteApp(appId)
    //   .then(() => {
    //     this.getApps();
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
