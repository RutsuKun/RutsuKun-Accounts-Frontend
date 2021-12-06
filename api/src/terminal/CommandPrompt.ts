import { Interface as RLInterface, createInterface } from "readline";
import { EventEmitter } from "events";
import { LoggerService } from "@services/LoggerService";

export declare interface CommandPrompt {
  on(event: "command", listener: (command: string) => void): this;
  on(event: "exit", listener: Function): this;
  on(event: string, listener: Function): this;
}

const Commands: CommandData[] = [
  {
    cmd: "exit",
    name: "Exit",
    description: "Ends all processes and exits.",
    handler: (ctx: CommandPrompt) => {
      ctx.emit("exit");
    },
  },
  {
    cmd: "help",
    name: "Help",
    description: "Show a list of commands.",
    handler: (ctx: CommandPrompt) => {
      ctx.logger.info("Available commands:");
      Commands.forEach((cmd) => {
        ctx.logger.info(`${cmd.cmd}: ${cmd.name} - ${cmd.description}`);
      });
    },
  },
];

export class CommandPrompt extends EventEmitter {
  public logger: LoggerService;
  private rl: RLInterface;

  constructor() {
    super();
    this.logger = new LoggerService().child({
      label: {
        type: "term",
        name: "Terminal",
      },
    });

    this.on("command", this.onCommand.bind(this));
  }

  public init() {
    this.rl = createInterface(process.stdin, process.stdout);
    this.rl.setPrompt("[dev@rd.api.main ~]$ ");
    this.rl.prompt();

    const ctx = this;
    this.rl.on("line", (line) => ctx.emit("command", removeCommand(line)));
  }

  public stop() {
    return new Promise<void>((resolve) => {
      this.rl.removeAllListeners();
      this.rl.close();
      resolve();
    });
  }

  private async onCommand(cmd: string) {
    const command = Commands.find((x) => x.cmd == cmd.toLowerCase());
    if (command) {
      command.handler(this);
    } else {
      // this.logger.error(`${cmd}: Command not found`);
    }
    if (cmd != "exit") this.rl.prompt();
  }
}

export interface CommandData {
  cmd: string;
  name: string;
  description: string;
  handler: (ctx: CommandPrompt) => void;
}

function rc(str: string, cmd: string) {
  if (str == "" || str.substr(0, 1) == " ") return cmd;
  else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return rc(str.substr(1), str.substr(0, 1) + cmd);
  }
}

function rev(r: string, acc: string) {
  if (r == "") return acc;
  else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return rev(r.substr(1), r[0] + acc);
  }
}

function reversed(r: string) {
  return rev(r, "");
}

function removeCommand(str: string) {
  return reversed(rc(str, ""));
}
