import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AccountFacade } from "@core/store/account/account.facade";
import { filter, pairwise, take } from "rxjs/operators";

@Component({
  templateUrl: "./account-apps-create.component.html",
  styleUrls: ["./account-apps-create.component.scss"],
})
export class AccountAppsCreateComponent implements OnInit {
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
    private fb: FormBuilder,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validate(): boolean {
    Object.keys(this.form.controls).forEach((name) => {
      this.form.get(name)?.markAsDirty();
    });
    return this.form.valid;
  }

  hasError(input: string, errorType?: string, formGroup?: FormGroup) {
    if (formGroup && errorType) {
      return (
        formGroup.get(input)?.dirty && formGroup.get(input)?.hasError(errorType)
      );
    }

    if (!errorType) {
      return !!this.form.get(input)?.errors;
    }

    return (
      this.form.get(input)?.dirty && this.form.get(input)?.hasError(errorType)
    );
  }

  createClient() {
    console.log(this.form);
    console.log(this.form.getRawValue());
    if (this.validate()) {
      this.accountFacade.createClient(this.form.getRawValue());
      this.accountFacade.clientCreateLoading$.pipe(pairwise(), filter(([prev, curr]) => !!prev && !curr), take(1)).subscribe(()=>{
        this.router.navigate(["account", "apps"]);
      });
    }
  }
}
