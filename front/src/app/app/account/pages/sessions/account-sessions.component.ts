import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subject } from "rxjs";

@Component({
  selector: "app-account-sessions",
  templateUrl: "./account-sessions.component.html",
  styleUrls: ["./account-sessions.component.scss"],
})
export class AccountSessionsComponent implements OnInit, OnDestroy {
  private uns$ = new Subject();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
