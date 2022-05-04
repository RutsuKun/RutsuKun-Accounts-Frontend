import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class AdminOAuthScopesViewComponent implements OnInit {
  uns$ = new Subject();
  scope: string = null;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.uns$)).subscribe((params)=>{
      if(params.has('scope')) {
        this.scope = params.get('scope');
      }
    })
  }

}
