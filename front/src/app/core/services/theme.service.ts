import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ActivationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { filter, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  constructor(
    private router: Router,
  ) {}
  public initialize() {
    console.log("[APP] Initialized Theme service");

    this.router.events
      .pipe(filter((event) => event instanceof ActivationEnd))
      .subscribe(() => {
        let lastChild = this.router.routerState.snapshot.root;

          const child = lastChild.children[0];

          

        if (child && child.url[0] && child.url[0].path.includes("account")) {
          document.body.classList.add("page-account");
        } else {
          document.body.classList.remove("page-account");
        }

        if (child && child.url[0] && child.url[0].path.includes("admin")) {
          document.body.classList.add("page-admin");
        } else {
          document.body.classList.remove("page-admin");
        }
      });
  }
}
