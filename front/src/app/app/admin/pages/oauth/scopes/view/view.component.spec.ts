import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOAuthScopesViewComponent } from './view.component';

describe('AdminOAuthScopesViewComponent', () => {
  let component: AdminOAuthScopesViewComponent;
  let fixture: ComponentFixture<AdminOAuthScopesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOAuthScopesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOAuthScopesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
