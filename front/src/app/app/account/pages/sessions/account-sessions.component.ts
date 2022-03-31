import { Component, OnDestroy, OnInit } from "@angular/core";
import { AccountFacade } from "@core/store/account/account.facade";

import { Subject } from "rxjs";

@Component({
  selector: "app-account-sessions",
  templateUrl: "./account-sessions.component.html",
  styleUrls: ["./account-sessions.component.scss"],
})
export class AccountSessionsComponent implements OnInit, OnDestroy {
  private uns$ = new Subject();

  sessions$ = this.accountFacade.sessionsData$;
  loading$ = this.accountFacade.sessionsLoading$;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.accountFacade.fetchSessions();
  }

  deleteSession(uuid: string) {
    this.accountFacade.deleteSession(uuid).subscribe((response) => {
      if (response.success) {
        this.accountFacade.fetchSessions();
      }
      console.log('response', response);
    });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
