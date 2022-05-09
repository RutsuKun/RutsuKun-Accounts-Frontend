import { Component, OnInit } from '@angular/core';
import { AccountFacade } from '@core/store/account/account.facade';
import { environment } from '@env/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class AccountConnectionsComponent implements OnInit {
  uns$ = new Subject();
  
  providers = [];
  loading$ = this.accountFacade.providersLoading$;


  authzData$ = this.accountFacade.authorizationsData$;
  authzLoading$ = this.accountFacade.authorizationsLoading$;

  constructor(
    private accountFacade: AccountFacade
  ) { }

  ngOnInit(): void {
    this.accountFacade.fetchProviders();
    this.accountFacade.fetchAuthorizations();
    this.subscribeProviders();
  }

  subscribeProviders() {
    this.accountFacade.providersData$.pipe(takeUntil(this.uns$)).subscribe((providers) => {
      this.providers = providers;
    })
  }

  getProviderByName(name: string) {
    name = name.toLowerCase();
    return this.providers.find(
      (provider) => provider.provider === name
    );
  }

  availableConnections() {
    return this.providers.length < 3;
  }

  connectProvider(provider: string) {
    location.href = `${environment.auth}/providers/${provider}`;
  }

  disconnectProvider(provider: string) {
    this.accountFacade.disconnectProvider(provider).subscribe(() => {
      this.accountFacade.fetchProviders();
    });
  }

  revokeAuthorization(uuid: string) {
    this.accountFacade.revokeAuthorization(uuid).subscribe(()=> {
      this.accountFacade.fetchAuthorizations();
    });
  }

}
