import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-permissions.component.html',
  styleUrls: ['./organization-permissions.component.scss']
})
export class AdminOrganizationPermissionsComponent implements OnInit {
  permissions = [];

  constructor(
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchInvitations(params.get("uuid"));
    });
  }

  fetchInvitations(uuid: string) {
    this.api.getOrganizationPermissions(uuid).then((permissions) => {
      this.permissions = permissions;
    })
  }
}
