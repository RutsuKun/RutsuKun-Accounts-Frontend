import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ReCaptchaV3Service } from "ng-recaptcha";
import { TranslateService } from "@ngx-translate/core";

import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from "angular-animations";

import { Subject } from "rxjs";
import { AuthFacade } from "@core/store/auth/auth.facade";


@Component({
  templateUrl: "./complete-signup.component.html",
  styleUrls: ["./complete-signup.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class CompleteSignUpComponent implements OnInit, OnDestroy {
  uns$ = new Subject();

  clientFromQuery: Array<any>;

  flow: "auth" | "oauth" = null;

  appInfoData$ = this.authFacade.appInfoData$;
  appInfoLoading$ = this.authFacade.appInfoLoading$;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private authFacade: AuthFacade
  ) {}

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
 
       console.log("client from url query", query);
 
       this.clientFromQuery = query.keys;
   
 
      //  this.checkAuthorization();
     });
  }

  // checkAuthorization() {
  //   this.recaptchaV3Service.execute("check").subscribe(() => {
  //     this.authFacade.check(this.flow);
  //   });
  // }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}

