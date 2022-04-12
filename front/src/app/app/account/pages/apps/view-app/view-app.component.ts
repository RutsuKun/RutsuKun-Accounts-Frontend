import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IOAuth2Client } from "@core/interfaces/IOAuth2Client";
import { AccountFacade } from "@core/store/account/account.facade";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";

@Component({
  templateUrl: "./view-app.component.html",
  styleUrls: ["./view-app.component.scss"],
})
export class AccountAppsViewComponent implements OnInit {
  app: IOAuth2Client;

  form: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    description: this.fb.control(null),
    website: this.fb.control(null),
    privacy_policy: this.fb.control(null),
    tos: this.fb.control(null),
    type: this.fb.control(null, [Validators.required]),
    redirect_uris: this.fb.control(null, [Validators.required]),
  });

  types = [
    {
      name: "Web (Web Server App)",
      value: "wsa",
    },
    {
      name: "SPA (Single Page App)",
      value: "spa",
    },
    {
      name: "Native",
      value: "native",
    },
    {
      name: "Mobile",
      value: "mobile",
    },
  ];

  constructor(
    private accountFacade: AccountFacade,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params) => {
      const client_id = params.get("client_id");
      this.fetchClient(client_id);
    });
  }

  fetchClient(client_id: string) {
    this.accountFacade.fetchClient(client_id).subscribe((data) => {
      if (!data) return;
      this.app = data;
      this.form.patchValue(data);
    });
  }

  updateClient() {
    this.accountFacade.updateClient(this.app.client_id, this.form.getRawValue()).subscribe((data) => {
      this.app = data;
    })
  }
}
