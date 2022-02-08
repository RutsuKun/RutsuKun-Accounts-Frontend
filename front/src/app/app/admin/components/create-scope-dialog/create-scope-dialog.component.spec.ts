import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateScopeDialogComponent } from './create-scope-dialog.component';

describe('AdminCreateScopeDialogComponent', () => {
  let component: AdminCreateScopeDialogComponent;
  let fixture: ComponentFixture<AdminCreateScopeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCreateScopeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateScopeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
