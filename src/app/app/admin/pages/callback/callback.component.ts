import { Component, OnInit } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.css"],
})
export class CallbackComponent implements OnInit {
  constructor(private oidcService: OidcSecurityService) {}
  ngOnInit(): void {
    this.oidcService.checkAuth().subscribe();
  }
}
