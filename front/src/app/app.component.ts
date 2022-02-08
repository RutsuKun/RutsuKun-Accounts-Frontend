import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ThemeService } from "@core/services/theme.service";
import { TitleService } from "@core/services/title.service";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng/api";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  uns$ = new Subject();

  currentService: string = null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private titleService: TitleService,
    private themeService: ThemeService
  ) {
    const lang = localStorage.getItem("lang");
    if (lang) {
      this.translateService.setDefaultLang(lang);
    } else {
      localStorage.setItem("lang", "en");
      this.translateService.setDefaultLang("en");
    }

    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.uns$))
      .subscribe((params) => {
        const service = params.get("service");
        const lang = params.get("lang");
        if (service) {
          this.currentService = service;
          document.body.classList.add(service);
        } else {
          document.body.classList.add("auth");
          document.body.classList.remove(this.currentService);
          this.currentService = null;
        }
        if (lang) {
          this.translateService.use(lang);
        }
      });

    this.themeService.initialize();
    this.titleService.initialize();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }
}
