import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IAccount } from '@core/interfaces/IAccount';
import { AccountFacade } from '@core/store/account/account.facade';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  uns$ = new Subject();
  account: IAccount = null;

  menu: MenuItem[] = [
    {
      label: 'General',
      items: [
        {
          label: "Account",
          icon: "pi pi-cog",
          routerLink: "/account/general"
        },
        {
          label: "Sessions",
          icon: "pi pi-lock",
          routerLink: "/account/sessions"
        }
      ],
    },
    {
      label: "OAuth2",
      items: [
        {
          label: "Apps",
          icon: "pi pi-table",
          routerLink: "/account/apps"
        }
      ]
    }
  ]

  constructor(
    private accountFacade: AccountFacade
  ) { }

  ngOnInit(): void {
    this.subscribeMe();
  }

  subscribeMe() {
    this.accountFacade.meData$.pipe(takeUntil(this.uns$)).subscribe((account)=>{
      this.account = account;
    })
  }

  ngOnDestroy(): void {
      this.uns$.next();
      this.uns$.complete();
  }
}
