import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInvitationsComponent } from './organization-invitations.component';

describe('OrganizationInvitationsComponent', () => {
  let component: OrganizationInvitationsComponent;
  let fixture: ComponentFixture<OrganizationInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationInvitationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
