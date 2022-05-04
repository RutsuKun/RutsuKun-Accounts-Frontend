import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecondaryEmailDialogComponent } from './add-secondary-email-dialog.component';

describe('AddSecondaryEmailDialogComponent', () => {
  let component: AddSecondaryEmailDialogComponent;
  let fixture: ComponentFixture<AddSecondaryEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSecondaryEmailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecondaryEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
