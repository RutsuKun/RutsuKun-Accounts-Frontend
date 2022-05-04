import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsCreateComponent } from './create-account.component';

describe('AdminAccountsCreateComponent', () => {
  let component: AdminAccountsCreateComponent;
  let fixture: ComponentFixture<AdminAccountsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAccountsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
