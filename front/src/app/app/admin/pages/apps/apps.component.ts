import { Component, OnInit } from '@angular/core';
import { AdminCreateAppDialogComponent } from '@app/admin/components/create-app-dialog/create-app-dialog.component';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { IOAuth2Client } from '@core/interfaces/IOAuth2Client';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AdminAppsComponent implements OnInit {
  apps: IOAuth2Client[] = [];
  constructor(private api: AdminApiService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.fetchApps();
  }

  fetchApps() {
    this.api.getApps().then((apps)=>{
      console.log(apps);
      this.apps = apps;
    }).catch((error)=>{
      console.error(error);
    })
  }

  openCreateAppDialog() {
    this.dialog.open(AdminCreateAppDialogComponent, {
      header: "Create app",
      modal: true,
      dismissableMask: true,
      styleClass: "w-11 md:w-6 lg:w-3",
    })
    .onClose.subscribe(() => {
      this.fetchApps();
    });
  }

}
