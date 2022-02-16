import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { FormService } from "@core/services/form.service";
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
    email: ['', [Validators.required]],
    password: [null, [Validators.required]],
  });

  reauthForm = this.fb.group({
    password: [null, [Validators.required]],
  });

  ssoForm = this.fb.group({
    organization: [null, [Validators.required]],
  });

  @Input() clientError: { error: string; error_description: string } = null;
  organization: { name: string; domain: string; } = null;


  loading$ = this.authFacade.signinLoading$;
  showForm$ = this.authFacade.signinShowForm$;
  error$ = this.authFacade.signinError$;
  appInfoOrganization$ = this.authFacade.appInfoOrganization$;

  type: any = null;
  
  session$ = this.authFacade.session$;
  
  @Input() redirectTo: string = null;

  constructor(
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authFacade: AuthFacade,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.subscribeOrganization();
    this.subscribeAuthType();
  }
  
  subscribeOrganization() {
    this.appInfoOrganization$.pipe(takeUntil(this.uns$)).subscribe((organization)=>{
      this.organization = organization;
      if(!this.organization) {
        this.authForm.get("email").setValidators([Validators.required, Validators.email]);
      } else {
        this.authForm.get("email").setValidators([Validators.required]);
      }
    })
  }

  hasError(input: string, type?: string) {
    return this.formService.hasError(this.authForm, input, type);
  }

  subscribeAuthType() {
    this.authFacade.type$.pipe(takeUntil(this.uns$)).subscribe((type)=>{
      this.type = type;
    })
  }

  get showOrganizationDomain() {
    return !!this.organization && this.organization.domain && !this.authForm.get("email").value.includes("@");
  }

  get checkValidEmail() {
    if(this.organization && this.organization.domain) {
      const formEmail = (this.authForm.get("email").value as string)
      const isEmail = formEmail.includes("@");
      if(isEmail) {
        const domain = formEmail.split("@")[1];
        if(domain !== this.organization.domain) return false;
      }
    }

    return true;
  }

  get formEmail() {
    const initialEmail = this.authForm.get("email").value as string;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialEmail);
    if(isEmail) return initialEmail;
    if(!initialEmail.includes("@") && this.organization) {
      return  `${initialEmail}@${this.organization.domain}`;
    }
    return initialEmail;
  }

  signin() {
    this.captcha.execute("signin").subscribe((token) => {
      if(!this.formService.validate(this.authForm) || !this.checkValidEmail) return;
      
      const data = {
        email: this.formEmail,
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

  ssoClick() {
    // todo
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

  switchToSamlSSO() {
    this.type = "sso";
  }
  switchToAuth() {
    this.type = "auth";
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
