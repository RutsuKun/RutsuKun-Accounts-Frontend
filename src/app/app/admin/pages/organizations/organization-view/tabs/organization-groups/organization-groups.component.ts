import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-groups.component.html',
  styleUrls: ['./organization-groups.component.scss']
})
export class AdminOrganizationGroupsComponent implements OnInit {

  groups = [];

  constructor(
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchGroups(params.get("uuid"));
    });
  }

  fetchGroups(uuid: string) {
    this.api.getOrganizationGroups(uuid).then((groups) => {
      this.groups = groups;
    })
  }

}
