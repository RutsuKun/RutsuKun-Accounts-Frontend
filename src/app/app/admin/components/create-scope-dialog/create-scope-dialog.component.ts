import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { FormService } from '@core/services/form.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  templateUrl: './create-scope-dialog.component.html',
  styleUrls: ['./create-scope-dialog.component.scss']
})
export class AdminCreateScopeDialogComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: this.fb.control(null, Validators.required),
    default: this.fb.control(false),
    system: this.fb.control(false)
  });
  constructor(private fb: FormBuilder, public formService: FormService, private api: AdminApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  createScope() {
    if(this.formService.validate(this.form)) {
      this.api.createScope(this.form.getRawValue()).then(()=>{
        this.ref.destroy();
        this.ref.close();
      }).catch((error)=>{

      })
    }
  }

}
