import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { AccountFacade } from "@core/store/account/account.facade";
import { filter, pairwise, take } from "rxjs/operators";

@Component({
  templateUrl: "./add-secondary-email-dialog.component.html",
  styleUrls: ["./add-secondary-email-dialog.component.css"],
})
export class AddSecondaryEmailDialogComponent implements OnInit {
  form: FormGroup = this.fb.group({
    email: this.fb.control(null, [Validators.required, Validators.email]),
  });

  constructor(
    private fb: FormBuilder,
    private accountFacade: AccountFacade,
    private ref: DynamicDialogRef
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

  addEmail() {
    if (this.validate()) {
      this.accountFacade.createEmail(this.form.getRawValue().email);
      this.accountFacade.emailCreateLoading$.pipe(pairwise(), filter(([prev, curr]) => !!prev && !curr), take(1)).subscribe(() => {
        this.ref.close();
      })
    }
  }
}
