import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackDebugComponent } from './callback-debug.component';

describe('CallbackComponent', () => {
  let component: CallbackDebugComponent;
  let fixture: ComponentFixture<CallbackDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallbackDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
