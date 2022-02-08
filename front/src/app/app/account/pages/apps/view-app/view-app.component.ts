import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOAuth2Client } from '@core/interfaces/IOAuth2Client';
import { AccountFacade } from '@core/store/account/account.facade';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './view-app.component.html',
  styleUrls: ['./view-app.component.scss']
})
export class AccountAppsViewComponent implements OnInit {

  constructor(
    private accountFacade: AccountFacade,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params) => {
      const client_id = params.get("client_id");
      this.accountFacade.fetchClient(client_id);
    })
    this.subscribeViewClient();
  }

  subscribeViewClient() {
    this.accountFacade.clientViewData$.subscribe((client)=>{
      console.log("done", client);
      
    })
  }

}
