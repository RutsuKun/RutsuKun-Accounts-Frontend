import {
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
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

    isDevelop = environment.envName === "DEV";

    constructor(
        private authFacade: AuthFacade
    ) {}

    ngOnInit() {
        this.authFacade.fetchSession();
    }

    logout() {
        this.authFacade.endSession();
    }


}
