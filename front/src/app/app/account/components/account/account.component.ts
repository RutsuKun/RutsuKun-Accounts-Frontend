import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IAccount } from '@core/interfaces/IAccount';
import { AccountFacade } from '@core/store/account/account.facade';
import { AuthFacade } from '@core/store/auth/auth.facade';
import { ISession } from '@core/store/auth/auth.state';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-account-page",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit, OnDestroy {
  uns$ = new Subject();
  account: ISession = null;

  menu: MenuItem[] = [
    {
      label: "General",
      items: [
        {
          label: "Account",
          icon: "pi pi-cog",
          routerLink: "/account/general",
        },
        {
          label: "Sessions",
          icon: "pi pi-lock",
          routerLink: "/account/sessions",
        },
      ],
    },
    {
      label: "OAuth2",
      items: [
        {
          label: "Apps",
          icon: "pi pi-table",
          routerLink: "/account/apps",
        },
      ],
    },
  ];

  constructor(
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.subscribeCurrentSession();
  }

  subscribeCurrentSession() {
    this.authFacade.sessionCurrent$
      .pipe(takeUntil(this.uns$))
      .subscribe((currentSession) => {
        if (!currentSession) return;
        this.account = currentSession.account;
      });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
