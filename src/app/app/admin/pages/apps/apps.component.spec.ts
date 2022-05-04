import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppsComponent } from './apps.component';

describe('AdminAppsComponent', () => {
  let component: AdminAppsComponent;
  let fixture: ComponentFixture<AdminAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAppsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
