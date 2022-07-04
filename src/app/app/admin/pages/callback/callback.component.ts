import { Component, OnDestroy, OnInit } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.css"],
})
export class CallbackComponent implements OnInit, OnDestroy {
  private uns$ = new Subject();
  constructor(private oidcService: OidcSecurityService) {}
  ngOnInit(): void {
    this.oidcService.checkAuth().pipe(takeUntil(this.uns$)).subscribe();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
