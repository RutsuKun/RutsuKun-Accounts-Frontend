import {
    Component,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { AuthService } from "@app/admin/services/auth.service";
import { AuthFacade } from "@core/store/auth/auth.facade";
import { environment } from "@env/environment";
import { Subject } from "rxjs";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit {
    public session$ = this.authFacade.session$;

    isDev = environment.envName === "DEV";
    isProd = environment.envName === "PROD";
    @Input() isAdmin = false;

    constructor(
        private authFacade: AuthFacade,
        private auth: AuthService
    ) {}

    ngOnInit() {
        this.authFacade.fetchSession();
    }

    logout() {
        this.authFacade.endSession();
    }

    logoutLocal() {
        this.auth.logoutLocal();
    }
    
    logoutSession() {
        this.auth.logout();
    }
}
