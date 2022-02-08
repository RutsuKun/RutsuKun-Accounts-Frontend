import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateAppDialogComponent } from './create-app-dialog.component';

describe('AdminCreateAppDialogComponent', () => {
  let component: AdminCreateAppDialogComponent;
  let fixture: ComponentFixture<AdminCreateAppDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCreateAppDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateAppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
