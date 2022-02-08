import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class AdminSettingsComponent implements OnInit {
  memberTypes = [
    {
      name: "Members",
      value: "members",
    },
    {
      name: "Invitations",
      value: "invitations",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
