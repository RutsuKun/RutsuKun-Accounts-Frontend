import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOAuthComponent } from './oauth.component';

describe('AdminOAuthComponent', () => {
  let component: AdminOAuthComponent;
  let fixture: ComponentFixture<AdminOAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
