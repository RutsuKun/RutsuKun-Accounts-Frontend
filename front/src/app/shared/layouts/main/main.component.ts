import { MediaMatcher } from "@angular/cdk/layout";
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Title } from "@angular/platform-browser";

/** @title Responsive sidenav */
@Component({
  selector: "app-main-layout",
  templateUrl: "main.component.html",
  styleUrls: ["main.component.scss"]
})
export class MainComponent implements OnDestroy, AfterViewInit {
  lang: string;
  debug: boolean;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public translate: TranslateService,
    private titleService: Title
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    const lang = localStorage.getItem("lang");
    if (lang) {
      this.lang = lang;
    } else {
      localStorage.setItem("lang", "en");
      this.lang = "en";
    }

    if (!localStorage.getItem("debug")) {
      localStorage.setItem("debug", "false");
      this.debug = false;
    }
    if (localStorage.getItem("debug") === "true") {
      this.debug = true;
    }
  }

  setTitle() {
    this.translate.get("signin").subscribe((text: string) => {
      this.titleService.setTitle(text + " - RutsuKun Accounts");
    });
  }

  changeLang(l: string) {
    this.translate.use(l);
    this.lang = l;
    localStorage.setItem("lang", l);
    this.setTitle();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}
}
