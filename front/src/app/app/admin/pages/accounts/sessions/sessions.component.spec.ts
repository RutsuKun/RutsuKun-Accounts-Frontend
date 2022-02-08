import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsSessionsComponent } from './sessions.component';

describe('AdminAccountsSessionsComponent', () => {
  let component: AdminAccountsSessionsComponent;
  let fixture: ComponentFixture<AdminAccountsSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAccountsSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountsSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
