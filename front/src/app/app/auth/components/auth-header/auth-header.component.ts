import {
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { environment } from "@env/environment";

import { Subject } from "rxjs";


@Component({
    selector: "app-auth-header",
    templateUrl: "auth-header.component.html",
    styleUrls: ["auth-header.component.scss"],
})
export class AuthHeaderComponent implements OnInit, OnDestroy {
    private uns$ = new Subject();
    public session$ = this.authFacade.session$;

    isDevelop = environment.envName === "DEV";

    constructor(
        private authFacade: AuthFacade
    ) {}

    ngOnInit(): void {
        this.authFacade.fetchSession();
    }
    
    logout() {
        this.authFacade.endSession();
    }

    ngOnDestroy(): void {
        this.uns$.next();
        this.uns$.complete();
    }
}
