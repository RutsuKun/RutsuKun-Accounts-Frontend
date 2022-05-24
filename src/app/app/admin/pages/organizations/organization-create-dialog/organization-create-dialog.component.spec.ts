import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCreateDialogComponent } from './organization-create-dialog.component';

describe('OrganizationCreateDialogComponent', () => {
  let component: OrganizationCreateDialogComponent;
  let fixture: ComponentFixture<OrganizationCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCreateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
