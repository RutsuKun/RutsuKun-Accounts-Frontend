import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AuthFacade } from '@core/store/auth/auth.facade';

@Component({
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.scss']
})
export class ChooseAccountComponent implements OnInit {
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

  goToSignIn() {
    this.authService.redirectToSignIn();
  }

}
