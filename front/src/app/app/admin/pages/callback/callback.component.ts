import { Component, OnInit } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.css"],
})
export class CallbackComponent implements OnInit {
  constructor(private oidcService: OidcSecurityService) {}

  ngOnInit(): void {
    console.log("callback", window.location.href);

    this.oidcService.checkAuth(window.location.href, "default").subscribe();
  }
}
