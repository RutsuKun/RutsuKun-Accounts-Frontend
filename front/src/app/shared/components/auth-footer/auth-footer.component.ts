import {
    Component,
    OnDestroy,
} from "@angular/core";

import { Subject } from "rxjs";

@Component({
    selector: "app-auth-footer",
    templateUrl: "./auth-footer.component.html",
    styleUrls: ["./auth-footer.component.scss"],
})
export class AuthFooterComponent implements OnDestroy {
    private uns$ = new Subject();
    

    constructor() { }

    ngOnDestroy(): void {
        this.uns$.next();
        this.uns$.complete();
    }
}
