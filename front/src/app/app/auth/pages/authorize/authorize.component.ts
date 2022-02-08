import { Component, OnInit } from "@angular/core";
import { IAuthConsent } from "@core/interfaces/IAuth";
import { AuthService } from "@core/services/auth.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";



@Component({
    templateUrl: "./authorize.component.html",
    styleUrls: ["./authorize.component.scss"],
    animations: [
        fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
        fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
    ],
})
export class AuthorizeComponent implements OnInit {
    public consent: IAuthConsent = null;
    public formLoading = false;

    constructor(
        private authFacade: AuthFacade,
        private captcha: ReCaptchaV3Service,
        private auth: AuthService
    ) {
        this.authFacade.fetchSession();
    }

    ngOnInit(): void {
        this.check()
        this.subscribeConsent();
    }

    subscribeConsent() {
        this.authFacade.authorizeConsent$.subscribe((consent) => {
            if (consent.client) {
                this.consent = {
                    client: consent.client,
                    // @ts-ignore
                    scopes: consent.scope.split(" ")
                };
            }
        })
    }

    check() {
        this.captcha.execute("check").subscribe((token) => {
            this.authFacade.check('oauth');
        });
    }

    authorize(data) {
        this.authFacade.authorize(data);
    }

    setFormLoading() {
        this.formLoading = true;
      }
}

