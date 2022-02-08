import { CommandPrompt } from './terminal/CommandPrompt';
import { App } from './app';

import { EventEmitter } from 'events';

export class Terminal extends EventEmitter {
    // private logger: Logger;
    private app: App;

    private cmdPrompt: CommandPrompt;

    constructor(appInstance: App) {
        super();

        this.app = appInstance;
        // this.logger = Logger.child({ label: { type: 'mapi', name: 'Main API' } });

        this.cmdPrompt = new CommandPrompt();

        const ctx = this;
        this.cmdPrompt.on('exit', () => ctx.stop());
    }

    async init() {
        // this.logger.info('Initializing Terminal');
        this.cmdPrompt.init();
    }

    async stop() {
        // this.logger.info('Shutting down...');
        await this.cmdPrompt.stop();
        this.app.requestStop();
    }
}
