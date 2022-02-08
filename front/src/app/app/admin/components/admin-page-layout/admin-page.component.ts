import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthService } from "./../../services/auth.service";


@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.scss"],
})
export class AdminPageComponent implements OnInit {
  private uns$ = new Subject();
  public session$ = this.authFacade.session$;

  constructor(
    private authFacade: AuthFacade,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authFacade.fetchSession();
  }

  logoutLocal() {
    this.auth.logoutLocal();
  }

  logoutSession() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
