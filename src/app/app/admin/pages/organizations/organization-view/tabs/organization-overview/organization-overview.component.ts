import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { FormService } from '@core/services/form.service';

@Component({
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class AdminOrganizationOverviewComponent implements OnInit {
  overview = null;
  form: FormGroup = this.fb.group({
    name: this.fb.control(null, Validators.required),
    description: this.fb.control(null),
    domain: this.fb.control(null),
  });
  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchOverview(params.get("uuid"));
    });
  }

  fetchOverview(uuid: string) {
    this.api.getOrganizationOverview(uuid).then((overview) => {
      this.overview = overview;
      this.form.patchValue(overview);
    })
  }

  saveOrganization() {}
}
