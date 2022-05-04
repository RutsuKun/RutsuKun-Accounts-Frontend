import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AuthFacade } from '@core/store/auth/auth.facade';
import { Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.scss']
})
export class ChooseAccountComponent implements OnInit, OnDestroy {
  uns$ = new Subject();

  flow: "auth" | "oauth" = null;

  appInfoData$ = this.authFacade.appInfoData$;
  appInfoLoading$ = this.authFacade.appInfoLoading$;

  sessions$ = this.authFacade.sessions$;

  constructor(
    private route: ActivatedRoute,
    private authFacade: AuthFacade,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscribeQuery();
    this.subscribeSessions();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

  subscribeQuery() {
    this.route.queryParamMap.subscribe((query) => {
      if (!!query.get("client_id")) {
        this.flow = "oauth";
        this.authFacade.fetchAppInfo(query.get("client_id"));
      } else {
        this.flow = "auth";
      }

    });
  }

  subscribeSessions() {
    this.sessions$.pipe(takeUntil(this.uns$), pairwise()).subscribe(([prev, curr])=>{
      if(!prev.length && !curr.length) this.authService.redirectToSignIn();
    })
  }

  chooseAccount(account_uuid: string) {
    this.authFacade.chooseAccount(account_uuid);
  }

  goToSignIn() {
    this.authService.redirectToSignInNextAccount();
  }

}
