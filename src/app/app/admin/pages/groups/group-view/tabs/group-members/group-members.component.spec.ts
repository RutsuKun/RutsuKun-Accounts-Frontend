import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupMembersComponent } from './group-members.component';

describe('AdminGroupMembersComponent', () => {
  let component: AdminGroupMembersComponent;
  let fixture: ComponentFixture<AdminGroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGroupMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
