import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizationGroupsComponent } from './organization-groups.component';

describe('AdminOrganizationGroupsComponent', () => {
  let component: AdminOrganizationGroupsComponent;
  let fixture: ComponentFixture<AdminOrganizationGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrganizationGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganizationGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
