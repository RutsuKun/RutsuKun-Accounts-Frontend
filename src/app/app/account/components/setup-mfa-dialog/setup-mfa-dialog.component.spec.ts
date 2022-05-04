import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupMfaDialogComponent } from './setup-mfa-dialog.component';

describe('SetupMfaDialogComponent', () => {
  let component: SetupMfaDialogComponent;
  let fixture: ComponentFixture<SetupMfaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupMfaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupMfaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
