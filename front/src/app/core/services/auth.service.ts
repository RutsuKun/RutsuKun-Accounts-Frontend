import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  redirectToSignIn() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["signin"], {
        queryParams: params,
      });
    });
  }
  redirectToMultifactor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["multifactor"], {
        queryParams: params,
      });
    });
  }
  redirectToAuthorize() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.router.navigate(["oauth2", "authorize"], {
        queryParams: params,
      });
    });
  }

}
