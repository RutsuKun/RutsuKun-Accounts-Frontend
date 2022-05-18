import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';
import { IAccount } from '@core/interfaces/IAccount';

@Component({
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class AdminGroupMembersComponent implements OnInit {
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
    this.api.getGroupMembers(uuid).then((members) => {
      this.members = members;
    })
  }

}
