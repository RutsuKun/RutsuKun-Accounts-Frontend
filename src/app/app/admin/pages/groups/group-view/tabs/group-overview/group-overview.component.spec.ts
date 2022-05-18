import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupOverviewComponent } from './group-overview.component';

describe('AdminGroupOverviewComponent', () => {
  let component: AdminGroupOverviewComponent;
  let fixture: ComponentFixture<AdminGroupOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGroupOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
