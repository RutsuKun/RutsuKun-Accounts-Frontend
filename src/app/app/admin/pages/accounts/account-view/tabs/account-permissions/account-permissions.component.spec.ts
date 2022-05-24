import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountPermissionsComponent } from './account-permissions.component';

describe('AdminAccountPermissionsComponent', () => {
  let component: AdminAccountPermissionsComponent;
  let fixture: ComponentFixture<AdminAccountPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAccountPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
