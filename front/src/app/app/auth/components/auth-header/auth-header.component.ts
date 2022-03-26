import {
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
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

    public sessions: IBrowserSession[] = [];

    isDevelop = environment.envName === "DEV";

    constructor(
        private authFacade: AuthFacade
    ) {}

    ngOnInit(): void {
        this.authFacade.fetchSession();
        this.authFacade.fetchSessions();
        this.subscribeSessions();
    }

    subscribeSessions() {
        this.authFacade.sessions$.pipe(takeUntil(this.uns$)).subscribe((sessions) => {
            this.sessions = sessions;
        })
    }
    
    logout() {
        this.authFacade.endSession();
    }

    getCurrentSession() {
        const currentSession = this.sessions.find((s) => s && s.current);
        if (!currentSession) return null;
        return currentSession;
    }

    getCurrentSessionAccount() {
        const currentSession = this.sessions.find((s) => s && s.current);
        if (!currentSession) return null;
        return currentSession.account;
    }

    getOtherSessions() {
        const otherSessions = this.sessions.filter((s) => s && !s.current);
        if (!otherSessions) return null;
        return otherSessions;
    }

    changeSession(uuid: string) {
        this.authFacade.changeSession(uuid);
    }

    ngOnDestroy(): void {
        this.uns$.next();
        this.uns$.complete();
    }
}
