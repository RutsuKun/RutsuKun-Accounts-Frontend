import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

import { Subject } from "rxjs";
import { environment } from "@env/environment";
import { DialogService } from "primeng/dynamicdialog";
import { AddSecondaryEmailDialogComponent } from "../../components/add-secondary-email-dialog/add-secondary-email-dialog.component";
import { SetupMfaDialogComponent } from "@app/account/components/setup-mfa-dialog/setup-mfa-dialog.component";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { AccountFacade } from "@core/store/account/account.facade";
import { IAccount, IAccountEmail } from "@core/interfaces/IAccount";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-account-general",
  templateUrl: "./account-general.component.html",
  styleUrls: ["./account-general.component.scss"],
  providers: [DialogService],
})
export class AccountGeneralComponent implements OnInit, OnDestroy {
  private uns$ = new Subject();
  public session$ = this.authFacade.session$;

  public account: IAccount = null;
  loading$ = this.accountFacade.meLoading$;

  activeChangeUsername = false;

  constructor(
    private authFacade: AuthFacade,
    private accountFacade: AccountFacade,
    public dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.subscribeMe();

    this.accountFacade.fetchMe();
  }

  subscribeMe() {
    this.accountFacade.meData$.pipe(takeUntil(this.uns$)).subscribe((account)=>{
      this.account = account;
    })
  }

  toggleChangeUsername() {
    this.activeChangeUsername = !this.activeChangeUsername;
  }

  cancelChangeUsername() {
    this.toggleChangeUsername();
    // todo
  }

  confirmChangeUsername() {
    this.toggleChangeUsername();
    // todo
  }

  getGroups() {
    if(this.account && this.account.groups.length) {      
      return this.account.groups.map(group=>group.display_name);
    } else {
      return null;
    }
  }

  getProviderByName(name: string) {
    name = name.toLowerCase();
    return this.account ? this.account.providers.find(
      (provider) => provider.provider === name
    ) : null;
  }

  connectProvider(provider: string) {
    location.href = `${environment.auth}/providers/${provider}`;
  }

  disconnectProvider(provider: string) {
    location.href = `${environment.auth}/providers/${provider}/disconnect`;
  }

  openAddSecondaryEmailDialog() {
    const ref = this.dialogService.open(AddSecondaryEmailDialogComponent, {
      header: "Add recovery email",
      modal: true,
      dismissableMask: true,
      styleClass: "w-11 lg:w-3",
    });
    ref.onClose.subscribe(() => {
      ref.destroy();
    });
  }

  deleteEmail(uuid: string) {
    this.accountFacade.deleteEmail(uuid);
  }

  openSetupMfaDialog(type: string) {
    const ref = this.dialogService.open(SetupMfaDialogComponent, {
      header: "Multi-factor authentication",
      modal: true,
      dismissableMask: true,
      style: { 'max-width': '424px', 'z-index': '1100' },
      data: {
        type
      }
    });
    ref.onClose.subscribe((data: any) => {
      ref.destroy();
    });
  }

  disableMfa(type: string) {
    this.accountFacade.mfaDisable(type);
  }

  isActiveAuthnMethod(type: 'OTP' | 'EMAIL' | 'HWK') {
    return this.account ? this.account.authn_methods.find((method)=> method.type === type && !!method.enabled) : false;
  }

  availableConnections() {
    return this.account.providers.length < 3;
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
