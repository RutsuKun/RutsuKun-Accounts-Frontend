import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { IOrganization } from '@core/interfaces/IOrganization';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminOrganizationCreateDialogComponent } from './organization-create-dialog/organization-create-dialog.component';

@Component({
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class AdminOrganizationsComponent implements OnInit {
  orgs: IOrganization[] = [];
  constructor(
    private router: Router,
    private api: AdminApiService,
    private dialog: DialogService,
    private confirmationService: ConfirmationService
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
        disabled: true
      },
      {
        separator: true,
      },
      {
        label: "Delete Organization",
        icon: "pi pi-trash",
        command: () => {
          this.confirmationService.confirm({
            header: "Delete organization",
            message: "Are you sure that you want to delete organization?",
            icon: "pi pi-info-circle",
            accept: () => {
              this.api.deleteOrganization(org.uuid).then(() => {
                this.fetchOrgs();
              })
            }
          });
        },
        styleClass: "danger",
      },
    ];
  }

  openCreateOrganizationDialog() {
    this.dialog
      .open(AdminOrganizationCreateDialogComponent, {
        header: "Create organization",
        modal: true,
        dismissableMask: true,
        styleClass: "w-11 md:w-6 lg:w-3",
      })
      .onClose.subscribe(() => {
        this.fetchOrgs();
      });
  }

}
