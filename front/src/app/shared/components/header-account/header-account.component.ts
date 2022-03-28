import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AuthFacade } from '@core/store/auth/auth.facade';
import { environment } from '@env/environment';

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

  constructor(
    private authFacade: AuthFacade,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authFacade.endSession();
  }

  changeSession(uuid: string) {
    this.authFacade.changeSession(uuid);
  }

  addNextAccount() {
    this.authService.redirectToSignInNextAccount();
  }
}
