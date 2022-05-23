import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizationPermissionsComponent } from './organization-permissions.component';

describe('AdminOrganizationPermissionsComponent', () => {
  let component: AdminOrganizationPermissionsComponent;
  let fixture: ComponentFixture<AdminOrganizationPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrganizationPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganizationPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
