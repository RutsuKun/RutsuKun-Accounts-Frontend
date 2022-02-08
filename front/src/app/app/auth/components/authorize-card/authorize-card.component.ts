import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthFacade } from "@core/store/auth/auth.facade";
import {
    fadeInOnEnterAnimation,
    fadeOutOnLeaveAnimation,
} from "angular-animations";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
    selector: "app-authorize-card",
    templateUrl: "./authorize-card.component.html",
    styleUrls: ["./authorize-card.component.scss"],
    animations: [
        fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
        fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
    ],
})
export class AuthorizeCardComponent implements OnInit {
    @Output() auth: EventEmitter<any> = new EventEmitter();
    @Output() authorize: EventEmitter<any> = new EventEmitter();
    @Output() setLoading: EventEmitter<any> = new EventEmitter();

    @Input() loading = false;
    @Input() consent = null;
    public session$ = this.authFacade.session$;

    constructor(
        private captcha: ReCaptchaV3Service,
        private authFacade: AuthFacade
    ) { }

    ngOnInit(): void { }

    authorizeClick(consentGiven: boolean) {
        this.setLoading.emit();
        this.captcha.execute("consent").subscribe((token) => {
            const data = {
                scope: this.consent.scopes.join(" "),
                consentGiven: consentGiven,
                captcha: token,
            };
            this.authorize.next(data);
        });
    }

    logout() { }
}
