import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class AdminOrganizationOverviewComponent implements OnInit {
  overview = [];

  constructor(
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
    })
  }
}
