import { Component, OnInit } from "@angular/core";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from "angular-animations";

@Component({
    selector: "app-forget-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.scss"],
    animations: [
        fadeInOnEnterAnimation({ anchor: "enter", duration: 1000 }),
        fadeOutOnLeaveAnimation({ anchor: "leave", duration: 1000 }),
    ],
})
export class ForgotPasswordComponent implements OnInit {
    formLoading: boolean = false;
    formError: string = null;
    ngOnInit(): void {

    }

    onAuth(data) {

    }
}