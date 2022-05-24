import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './account-permissions.component.html',
  styleUrls: ['./account-permissions.component.scss']
})
export class AdminAccountPermissionsComponent implements OnInit {
  permissions = [];

  constructor(
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchPermissions(params.get("uuid"));
    });
  }

  fetchPermissions(uuid: string) {
    this.api.getAccountPermissions(uuid).then((permissions) => {
      this.permissions = permissions;
    })
  }

  getSourceName(source) {
    switch(source.type) {
      case "ORGANIZATION-MEMBER": return "Organization Member"
      break;
      case "ORGANIZATION-GROUP": return "Organization Group"
      break;
      case "ACL-ACCOUNT": return "Acl Account"
      break;
      case "ACL-GROUP": return "Acl Group"
      break;
    }
  }

  getSourceTagColor(source) {
    switch(source.type) {
      case "ORGANIZATION-MEMBER": return "success"
      break;
      case "ORGANIZATION-GROUP": return "info"
      break;
      case "ACL-ACCOUNT": return "warning"
      break;
      case "ACL-GROUP": return "danger"
      break;
    }
  }
}
