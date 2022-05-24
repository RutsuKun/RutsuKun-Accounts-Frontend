import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss']
})
export class AdminOrganizationMembersComponent implements OnInit {
  members = [];

  constructor(
    private api: AdminApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe((params) => {
      this.fetchMembers(params.get("uuid"));
    });
  }

  fetchMembers(uuid: string) {
    this.api.getOrganizationMembers(uuid).then((members) => {
      this.members = members;
    })
  }

  getPermissionSourcesString(permission) {
    return permission.sources.map(s => '• ' + s.type).join('\r\n')
  }

  getSourceName(source) {
    switch(source.type) {
      case "ORGANIZATION-MEMBER": return "Organization Member"
      break;
      case "ORGANIZATION-GROUP": return "Organization Group"
      break;
      case "ACL-ACCOUNT": return "Account"
      break;
      case "ACL-GROUP": return "Group"
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
