import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { AuthService } from "../../services/auth.service";

@Component({
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class AdminSignInComponent implements OnInit {
  authForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });

  formError = this.authService.error$;
  formShow = false;
  formLoading = false;

  constructor(
    private fb: FormBuilder,
    private captcha: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.formShow = true;
    }, 200);
    this.activatedRoute.data.subscribe((data) => {
      console.log('data', data);
      
      if(data.error) {
        this.formError = data.error
      }
    })
  }

  signin() {
    this.formLoading = true;
    setTimeout(() => {
      this.formLoading = false;
      this.authService.authorize();
    }, 300);
  }
}
