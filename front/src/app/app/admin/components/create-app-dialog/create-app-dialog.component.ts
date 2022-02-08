import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { FormService } from '@core/services/form.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  templateUrl: './create-app-dialog.component.html',
  styleUrls: ['./create-app-dialog.component.scss']
})
export class AdminCreateAppDialogComponent implements OnInit {

  form: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    description: this.fb.control(null),
    website: this.fb.control(null),
    privacy_policy: this.fb.control(null),
    tos: this.fb.control(null),
    response_types: this.fb.control([], [Validators.required]),
    grant_types: this.fb.control([], [Validators.required]),
    redirect_uris: this.fb.control(null, [Validators.required]),
    third_party: this.fb.control(false),
    verified: this.fb.control(false),
    consent: this.fb.control(null),
  });

  response_types = [
    {
      name: "Token",
      value: "token",
    },
    {
      name: "Code",
      value: "code",
    },
    {
      name: "ID Token",
      value: "id_token",
    }
  ];

  grant_types = [
    {
      name: "Authorization Code",
      value: "authorization_code",
    },
    {
      name: "Client Credentials",
      value: "client_credentials",
    }
  ];

  constructor(private fb: FormBuilder, private formService: FormService, private api: AdminApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  createClient() {
    console.log(this.form.getRawValue());
    if(this.formService.validate(this.form)) {
      this.api.createApp(this.form.getRawValue()).then(()=>{
        this.ref.destroy();
        this.ref.close();
      }).catch((error)=>{

      })
    }
  }

}
