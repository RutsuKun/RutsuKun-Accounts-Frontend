import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AuthFacade } from '@core/store/auth/auth.facade';
import { environment } from '@env/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: "app-header-account",
  templateUrl: "./header-account.component.html",
  styleUrls: ["./header-account.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderAccountComponent implements OnInit {
  sessions$ = this.authFacade.sessions$;
  sessionCurrent$ = this.authFacade.sessionCurrent$;
  sessionsOther$ = this.authFacade.sessionsOther$;

  isDevelop = environment.envName === "DEV";
  @Input() isAdmin = false;

  adminAccount$ = this.oidcSecurityService.userData$;

  constructor(
    private authFacade: AuthFacade,
    private authService: AuthService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authFacade.endSession();
  }

  logoutLocal() {
    this.oidcSecurityService.logoffLocal();
    this.router.navigate(["/admin/signin"]);
  }

  logoutSession() {
    this.oidcSecurityService.logoff();
  }

  changeSession(uuid: string) {
    this.authFacade.changeSession(uuid);
  }

  addNextAccount() {
    this.authService.redirectToSignInNextAccount();
  }
}
