import {
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { AuthService } from "@core/services/auth.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { IBrowserSession } from "@core/store/auth/auth.state";
import { environment } from "@env/environment";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
    selector: "app-auth-header",
    templateUrl: "auth-header.component.html",
    styleUrls: ["auth-header.component.scss"],
})
export class AuthHeaderComponent implements OnInit, OnDestroy {
    private uns$ = new Subject();

    constructor(
        private authFacade: AuthFacade,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authFacade.fetchSessions();
    }

    ngOnDestroy(): void {
        this.uns$.next();
        this.uns$.complete();
    }
}
