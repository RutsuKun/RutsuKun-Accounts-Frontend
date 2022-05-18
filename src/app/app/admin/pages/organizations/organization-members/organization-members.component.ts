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
}
