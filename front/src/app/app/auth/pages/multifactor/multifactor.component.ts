import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthFacade } from "@core/store/auth/auth.facade";

@Component({
  templateUrl: "./multifactor.component.html",
  styleUrls: ["./multifactor.component.scss"],
})
export class MultifactorComponent implements OnInit {
  flow: "auth" | "oauth" = "auth";

  appInfoData$ = this.authFacade.appInfoData$;
  appInfoLoading$ = this.authFacade.appInfoLoading$;

  constructor(
    private route: ActivatedRoute,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.subscribeQueryParams();
    this.authFacade.check(this.flow);
  }

  subscribeQueryParams() {
    this.route.queryParamMap.subscribe((query) => {
      if (!!query.get("client_id")) {
        this.flow = "oauth";
        this.authFacade.fetchAppInfo(query.get("client_id"));
      }
    });
  }
}
