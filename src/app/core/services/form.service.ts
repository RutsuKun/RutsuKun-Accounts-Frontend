import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  hasError(form: FormGroup, input: string, errorType?: string, formGroup?: FormGroup) {
    if (formGroup && errorType) {
      return (
        formGroup.get(input)?.dirty && formGroup.get(input)?.hasError(errorType)
      );
    }

    if (!errorType) {
      return !!form.get(input)?.errors;
    }

    return (
      form.get(input)?.dirty && form.get(input)?.hasError(errorType)
    );
  }

  validate(form: FormGroup): boolean {
    Object.keys(form.controls).forEach((name) => {
      form.get(name)?.markAsDirty();
    });
    return form.valid;
  }
}
