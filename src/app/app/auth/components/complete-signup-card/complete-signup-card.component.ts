import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { FormService } from "@core/services/form.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { environment } from "@env/environment";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
  selector: "app-complete-signup-card",
  templateUrl: "./complete-signup-card.component.html",
  styleUrls: ["./complete-signup-card.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class CompleteSignUpCardComponent implements OnInit, OnDestroy {
  uns$ = new Subject();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required]]
  });

  loading$ = this.authFacade.signinLoading$;
  error$ = this.authFacade.signinError$;
  appInfoOrganization$ = this.authFacade.appInfoOrganization$;

  session$ = this.authFacade.session$;
  
  @Input() redirectTo: string = null;

  showCodeInput = false;

  constructor(
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authFacade: AuthFacade,
    private formService: FormService
  ) {}

  ngOnInit(): void {}
  

  hasError(input: string, type?: string) {
    return this.formService.hasError(this.form, input, type);
  }

  sendCode() {
    this.captcha.execute("send_code").subscribe((token) => {
      // if(!this.formService.validate(this.form)) return;
      
      const data = {
        email: this.form.get("email").value,
        captcha: token,
      };
      this.authFacade.completeConnectProvider(data.email);

      this.showCodeInput = true;
      // this.authService.signin(data).then((data) => this.auth.next(data));
    });
  }

  completeSignup() {
    this.captcha.execute("complete_signup").subscribe((token) => {
      // if(!this.formService.validate(this.form)) return;
      
      const data = {
        email: this.form.get("email").value,
        code: this.form.get("code").value,
        captcha: token,
      };
      this.authFacade.completeConnectProvider(data.email, data.code);
      // this.authService.signin(data).then((data) => this.auth.next(data));
    });
  }

  redirectSignIn() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["signin"], {
        queryParams: params,
      });
    });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
