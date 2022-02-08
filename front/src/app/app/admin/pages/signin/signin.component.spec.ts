import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminSignInComponent } from "./signin.component";

describe("SigninComponent", () => {
  let component: AdminSignInComponent;
  let fixture: ComponentFixture<AdminSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSignInComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
