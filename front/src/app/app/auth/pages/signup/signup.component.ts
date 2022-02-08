import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";


import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";
import { AuthFacade } from "@core/store/auth/auth.facade";


@Component({
  selector: "app-register",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent implements OnInit {
  loading: boolean;
  formError = null;
  formLoading = false;

  flow: "auth" | "oauth" = null;

  appInfoData$ = this.authFacade.appInfoData$;
  appInfoLoading$ = this.authFacade.appInfoLoading$;

  constructor(
    private authService: AuthService,
    private authFacade: AuthFacade,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query) => {
      if (!!query.get("client_id")) {
        this.flow = "oauth";
        this.authFacade.fetchAppInfo(query.get("client_id"));
      } else {
        this.flow = "auth";
      }
    });
  }

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateUsername(username) {
    const re = /^\S+$/;
    return re.test(username);
  }

  clickCheckboxPrivacypolicyAndTos() {}
}
