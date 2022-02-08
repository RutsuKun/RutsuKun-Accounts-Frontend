import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from "angular-animations";
import { Subject } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@core/services/auth.service";

@Component({
  templateUrl: "./device-code.component.html",
  styleUrls: ["./device-code.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class OAuth2DeviceCodeComponent implements OnInit, OnDestroy {
  uns$ = new Subject();
  account: any;

  // new
  public prompt: "login" | "reauth" | "signup" = null;
  public formError: string = null;
  public formShow: boolean = true;
  public formLoading: boolean = false;
  public clientError: { error: string; error_description: string } = null;

  deviceCodeForm = this.fb.group({
    user_code: [null, [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.formShow = false;

    this.route.queryParams.subscribe((query: any) => {
      if (query.error) {
        this.clientError = {
          error: query.error,
          error_description: query.error_description,
        };

        return;
      }
    });
  }

  ngOnInit(): void {
    console.log("device code init");
  }

  setLoadingForm() {
    this.formLoading = true;
  }

  enterUserCode() {
    this.formLoading = true;
    // this.authService
    //   .device(this.deviceCodeForm.get("user_code").value)
    //   .then((data) => {
    //     const type = data.type;

    //     switch (type) {
    //       case "consent":
    //         this.authService.redirectToAuthorize();
    //         break;
    //     }
    //   });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    console.log("device code destroj");
  }
}
