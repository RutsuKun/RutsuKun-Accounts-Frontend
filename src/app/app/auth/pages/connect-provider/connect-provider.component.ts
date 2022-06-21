import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './connect-provider.component.html',
  styleUrls: ['./connect-provider.component.scss']
})
export class ConnectProviderComponent implements OnInit, OnDestroy {
  uns$ = new Subject();
  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activateRoute.queryParamMap.pipe(takeUntil(this.uns$)).subscribe((query) => {
      if(query.has('success')) {
        console.log('success');
        
        const opener = window.opener;
        console.log('opener ', opener);
        
        opener.postMessage({ success: Boolean(query.get('success')) }, window.origin);
      }
    })
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
