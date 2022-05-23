import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-apps.component.html',
  styleUrls: ['./organization-apps.component.scss']
})
export class AdminOrganizationAppsComponent implements OnInit {
  apps = [];

  constructor(
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchApps(params.get("uuid"));
    });
  }

  fetchApps(uuid: string) {
    this.api.getOrganizationApps(uuid).then((apps) => {
      this.apps = apps;
    })
  }

}
