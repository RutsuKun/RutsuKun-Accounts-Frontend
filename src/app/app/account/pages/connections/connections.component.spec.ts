import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConnectionsComponent } from './connections.component';

describe('AccountConnectionsComponent', () => {
  let component: AccountConnectionsComponent;
  let fixture: ComponentFixture<AccountConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountConnectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
