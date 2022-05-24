import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { FormService } from '@core/services/form.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-organization-create-dialog',
  templateUrl: './organization-create-dialog.component.html',
  styleUrls: ['./organization-create-dialog.component.scss']
})
export class AdminOrganizationCreateDialogComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: this.fb.control(null, Validators.required),
    description: this.fb.control(null),
    domain: this.fb.control(null),
  });
  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private api: AdminApiService,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
  }

  createOrganization() {
    if(this.formService.validate(this.form)) {
      this.api.createOrganization(this.form.getRawValue()).then(()=>{
        this.ref.destroy();
        this.ref.close();
      }).catch((error)=>{
        
      })
    }
  }

}
