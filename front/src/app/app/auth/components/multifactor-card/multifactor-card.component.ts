import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  selector: "app-auth-multifactor-card",
  templateUrl: "./multifactor-card.component.html",
  styleUrls: ["./multifactor-card.component.scss"],
  animations: [
    fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
    fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
  ],
})
export class AuthMultifactorCardComponent implements OnInit {


  @Input() formError: string = null;
  @Output() auth: EventEmitter<any> = new EventEmitter();
  @Input() loading = false;

  otpCode = '';

  constructor(
    private captcha: ReCaptchaV3Service,
    private authFacade: AuthFacade
  ) { }

  ngOnInit(): void { }



  multifactor() {
    this.captcha.execute("signup").subscribe((token) => {
      const data = {
        captcha: token,
      };
      this.authFacade.multifactorOTP(this.otpCode);
    });
  }

  logout() {
    this.authFacade.endSession();
  }

}
