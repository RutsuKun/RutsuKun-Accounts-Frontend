import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '@app/admin/services/admin-api.service';

@Component({
  templateUrl: './organization-invitations.component.html',
  styleUrls: ['./organization-invitations.component.scss']
})
export class AdminOrganizationInvitationsComponent implements OnInit {
  invitations = [];

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
    this.api.getOrganizationInvitations(uuid).then((invitations) => {
      this.invitations = invitations;
    })
  }
}
