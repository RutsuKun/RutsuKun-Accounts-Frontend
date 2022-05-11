import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AdminAppsSettingsComponent implements OnInit {

  app = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: AdminApiService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params) => {
      const client_id = params.get("client_id");
      this.fetchClient(client_id);
    });
  }

  private fetchClient(client_id: string) {
    this.api.getApp(client_id).then((data) => {
      if (!data) return;
      this.app = data;
    });
  }

}
