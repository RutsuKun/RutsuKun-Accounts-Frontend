import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";


@Component({
  selector: "app-signup-card",
  templateUrl: "./signup-card.component.html",
  styleUrls: ["./signup-card.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class SignUpCardComponent implements OnInit {
  form = this.fb.group({
    username: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
    repassword: [null, [Validators.required]],
  });

  loading$ = this.authFacade.signupLoading$;
  error$ = this.authFacade.signupError$;

  constructor(
    private authFacade: AuthFacade,
    private authService: AuthService,
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void { }

  signup() {
    this.captcha.execute("signup").subscribe((token) => {
      const data = {
        username: this.form.get("username").value,
        email: this.form.get("email").value,
        password: this.form.get("password").value,
        repassword: this.form.get("repassword").value,
        captcha: token,
      };
      this.authFacade.signup(data);
    });
  }

  redirectSignIn() {
    this.authService.redirectToSignIn();
  }
}
