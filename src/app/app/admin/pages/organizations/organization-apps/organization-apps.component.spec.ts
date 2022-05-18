import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizationAppsComponent } from './organization-apps.component';

describe('AdminOrganizationAppsComponent', () => {
  let component: AdminOrganizationAppsComponent;
  let fixture: ComponentFixture<AdminOrganizationAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrganizationAppsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganizationAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
