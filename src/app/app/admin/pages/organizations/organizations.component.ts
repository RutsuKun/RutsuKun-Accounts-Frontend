import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { IOrganization } from '@core/interfaces/IOrganization';
import { MenuItem } from 'primeng/api';

@Component({
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class AdminOrganizationsComponent implements OnInit {
  orgs: IOrganization[] = [];
  constructor(
    private router: Router,
    private api: AdminApiService
  ) { }

  ngOnInit(): void {
    this.fetchOrgs();
  }

  fetchOrgs() {
    this.api.getOrganizations().then((orgs)=>{
      this.orgs = orgs;
    }).catch((error)=>{
      console.error(error);
    })
  }

  generateOrgMenu(org: IOrganization): MenuItem[] {
    return [
      {
        label: "Overview",
        command: () => this.router.navigate(["/admin/organizations/", org.uuid, 'overview']),
      },
      {
        label: "Members",
        command: () => this.router.navigate(["/admin/organizations/", org.uuid, 'members']),
      },
      {
        label: "Invitations",
        command: () => this.router.navigate(["/admin/organizations/", org.uuid, 'invitations']),
      },
      {
        separator: true,
      },
      {
        label: "Delete Organization",
        icon: "pi pi-trash",
        command: () => {},
        styleClass: "danger"
      },
    ];
  }

}
