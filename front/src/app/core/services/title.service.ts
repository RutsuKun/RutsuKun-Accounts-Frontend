import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private translateService: TranslateService, private title: Title) { }
    public initialize() {
        console.log('[APP] Initialized Title service');

        this.router.events.pipe(filter(event => event instanceof ActivationEnd)).subscribe(() => {

            let lastChild = this.router.routerState.snapshot.root;
            while (lastChild.children.length) {
                lastChild = lastChild.children[0];
            }
            const data = lastChild.data;
            if (data && data.title) {
                this.translateService.get(data.title).subscribe((text: string) => {
                    this.title.setTitle(text + " - RutsuKun Accounts");
                });
            } else {
                this.title.setTitle("Untitled page - RutsuKun Accounts");
            }

        })
    }
}
