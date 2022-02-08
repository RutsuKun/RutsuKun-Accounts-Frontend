import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifactorComponent } from './multifactor.component';

describe('MultifactorComponent', () => {
  let component: MultifactorComponent;
  let fixture: ComponentFixture<MultifactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultifactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
