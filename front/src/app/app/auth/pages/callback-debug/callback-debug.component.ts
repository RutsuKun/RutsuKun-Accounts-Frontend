import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router, ROUTER_INITIALIZER, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Clipboard } from "@angular/cdk/clipboard";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";

@Component({
  selector: "app-auth-callback-debug",
  templateUrl: "./callback-debug.component.html",
  styleUrls: ["./callback-debug.component.scss"],
})
export class CallbackDebugComponent implements OnInit {
  uns$ = new Subject();

  access_token: string = "";
  expires_in: number = null;
  token_type: string = "";
  id_token: string = "";
  code: string = "";
  state: string = "";
  session_state: string = "";

  error: string = null;
  error_description: string = null;

  exchanged = false;

  loading = false;

  clientId = "ec7d6daee653954707f260e5c0ae55ad83ba";
  redirect = "http://accounts.rutsukun.pl/debug";

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private clipboard: Clipboard,
    private http: HttpClient
  ) {
    this.route.fragment
      .pipe(takeUntil(this.uns$))
      .subscribe((fragment: string) => {
        if (!fragment) return;
        const result: any = fragment.split("&").reduce(function (res, item) {
          var parts = item.split("=");
          res[parts[0]] = parts[1];
          return res;
        }, {});

        if (result.access_token) this.access_token = result.access_token;
        if (result.token_type) this.token_type = result.token_type;
        if (result.id_token) this.id_token = result.id_token;
        if (result.code) this.code = result.code;
        if (result.state) this.state = result.state;
        if (result.session_state) this.session_state = result.session_state;
      });

    this.route.queryParamMap.pipe(takeUntil(this.uns$)).subscribe((query) => {
      if (!query.keys.length) return;
      const access_token = query.get("access_token");
      const id_token = query.get("id_token");
      const code = query.get("code");
      const state = query.get("state");
      if (access_token) this.access_token = access_token;
      if (id_token) this.id_token = id_token;
      if (code) this.code = code;
      if (state) this.state = state;

      this.cd.detectChanges();
    });
  }

  copyToClipboard(text: any) {
    const copied = this.clipboard.copy(text);
    console.log("copied", copied);
  }

  ngOnInit(): void {}

  redirectAuthorize(queryParams: any) {
    const params = new URLSearchParams(queryParams);
    window.location.href =
      "http://api.rutsukun.pl/v1/oauth2/authorize?" + params.toString();
  }

  exchangeCode() {
    if (this.code) {
      this.loading = true;
      this.http
        .post(`${environment.oauth}/token`, {
          grant_type: "authorization_code",
          client_id: this.clientId,
          redirect_uri: this.redirect,
          client_secret: "8fe256a2d9ce7de1321f06de3c19a7ff23cc",
          code: this.code,
        })
        .subscribe(
          (data: any) => {
            this.loading = false;
            const { access_token, id_token, type, expires_in } = data;
            if (access_token) this.access_token = access_token;
            if (type) this.token_type = type;
            if (expires_in) this.expires_in = expires_in;
            if (id_token) this.id_token = id_token;

            this.exchanged = true;

            this.cd.detectChanges();
          },
          ({ error }) => {
            this.loading = false;
            this.error = error.error;
            this.error_description = error.error_description;
            console.log(this.error, this.error_description);

            this.cd.detectChanges();
          }
        );
    }
  }
}
