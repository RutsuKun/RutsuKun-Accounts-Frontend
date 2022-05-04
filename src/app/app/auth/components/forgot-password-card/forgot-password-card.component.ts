import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";


@Component({
  selector: "app-forgot-password-card",
  templateUrl: "./forgot-password-card.component.html",
  styleUrls: ["./forgot-password-card.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class ForgotPasswordCardComponent implements OnInit {
  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });

  @Input() formError: string = null;
  @Output() auth: EventEmitter<any> = new EventEmitter();

  @Input() loading = false;

  constructor(
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  signin() {
    // if (this.form.valid) {
    this.captcha.execute("forgot-password").subscribe((token) => {
      const data = {
        type: "forgot-password",
        email: this.form.get("email").value,
        captcha: token,
      };

      this.auth.next(data);
    });
    // }
  }

  redirectSignIn() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["signin"], {
        queryParams: params,
      });
    });
  }
}
