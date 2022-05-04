import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit, OnDestroy {
  lang: string;
  debug: boolean;
  constructor(private titleService: Title, public translate: TranslateService) {
    this.titleService.setTitle("Auth - RutsuKun Accounts");
  }

  ngOnInit(): void {
    if (!document.body.classList.contains("page-auth")) {
      document.body.classList.add("page-auth");
    }
  }

  ngOnDestroy(): void {
    if (document.body.classList.contains("page-auth")) {
      document.body.classList.remove("page-auth");
    }
  }
}
