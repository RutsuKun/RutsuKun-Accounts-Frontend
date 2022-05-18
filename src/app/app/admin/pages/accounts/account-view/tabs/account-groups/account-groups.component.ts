import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './account-groups.component.html',
  styleUrls: ['./account-groups.component.scss']
})
export class AdminAccountGroupsComponent implements OnInit {

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
    this.api.getAccountGroups(uuid).then((groups) => {
      this.groups = groups;
    })
  }

}
