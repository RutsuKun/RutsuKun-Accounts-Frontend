import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { environment } from "@env/environment";
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
  selector: "app-signin-card",
  templateUrl: "./signin-card.component.html",
  styleUrls: ["./signin-card.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class SignInCardComponent implements OnInit, OnDestroy {
  uns$ = new Subject();

  authForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });

  reauthForm = this.fb.group({
    password: [null, [Validators.required]],
  });

  @Input() clientError: { error: string; error_description: string } = null;


  loading$ = this.authFacade.signinLoading$;
  showForm$ = this.authFacade.signinShowForm$;
  error$ = this.authFacade.signinError$;

  type: any = null;
  
  session$ = this.authFacade.session$;
  
  @Input() redirectTo: string = null;

  constructor(
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.subscribeAuthType();
  }
  
  subscribeAuthType() {
    this.authFacade.type$.pipe(takeUntil(this.uns$)).subscribe((type)=>{
      this.type = type;
    })
  }

  signin() {
    this.captcha.execute("signin").subscribe((token) => {
      const data = {
        email: this.authForm.get("email").value,
        password: this.authForm.get("password").value,
        captcha: token,
      };
      this.authFacade.signin(data);
      // this.authService.signin(data).then((data) => this.auth.next(data));
    });
  }

  reauthClick() {
    this.captcha.execute("reauth").subscribe((token) => {
      const data = {
        password: this.reauthForm.get("password").value,
        captcha: token,
      };
      this.authFacade.reauth(data);
    });
  }

  redirectSignUp() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["signup"], {
        queryParams: params,
      });
    });
  }

  redirectForgotPassword() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["forgot-password"], {
        queryParams: params,
      });
    });
  }

  authWithProvider(provider: string) {
    if (this.redirectTo) {
      location.href = `${environment.auth}/providers/${provider}?redirectTo=${this.redirectTo}`;
    } else {
      location.href = `${environment.auth}/providers/${provider}`;
    }
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
