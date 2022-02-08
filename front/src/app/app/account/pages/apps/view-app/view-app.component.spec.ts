import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAppsViewComponent } from './view-app.component';

describe('AccountAppsViewComponent', () => {
  let component: AccountAppsViewComponent;
  let fixture: ComponentFixture<AccountAppsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAppsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAppsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
