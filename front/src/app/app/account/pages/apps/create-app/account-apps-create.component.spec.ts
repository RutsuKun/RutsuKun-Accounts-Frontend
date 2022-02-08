import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountAppsCreateComponent } from "./account-apps-create.component";

describe("AccountAppsCreateComponent", () => {
  let component: AccountAppsCreateComponent;
  let fixture: ComponentFixture<AccountAppsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAppsCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAppsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
