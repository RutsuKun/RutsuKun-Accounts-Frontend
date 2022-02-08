import stackTrace from "stack-trace";
import { Logger as TSEDLogger } from "@tsed/logger";
import { Inject, Injectable } from "@tsed/common";
import { UseConnection } from "@tsed/typeorm";
import { LogRepository } from "../repositories/LogRepository";

@Injectable()
export class LoggerService {
  private name: string;
  private type: string;

  private logger: TSEDLogger;

  @Inject()
  @UseConnection("default")
  logRepository: LogRepository;

  constructor() {}

  public child(payload: LoggerOptions) {
    this.type = payload.label.type;
    this.name = payload.label.name;
    this.logger = new TSEDLogger(`${this.name} (${this.type})`);
    this.logger.appenders.set("std-log", {
      type: "stdout",
      layout: { type: "colored" },
      level: ["debug", "info", "trace", "error"],
    });

    return this;
  }

  // INFO LOG
  public info(message: string, payload?: any, supressDB = false) {
    //if (Config.Environment.NODE_ENV !== 'test')
    if(payload) {
      this.logger.info(message, payload);
    } else {
      this.logger.info(message);
    }
    

    if (supressDB !== true) {
      //this.db.dbInterface.logs.create({
      //	service: this.name,
      //	process: this.type,
      //	timestamp: new Date(),
      //	level: 'info',
      //	message: message,
      //	data: JSON.stringify(payload)
      //});
    }
  }

  // SUCCESS LOG
  public success(message: string, payload?: any, supressDB = false) {
    //if (Config.Environment.NODE_ENV !== 'test')
    this.logger.info(message);

    if (supressDB !== true) {
      //this.db.dbInterface.logs.create({
      //  service: this.name,
      //  process: this.type,
      //  timestamp: new Date(),
      //  level: 'success',
      //  message: message,
      //  data: JSON.stringify(payload)
      //});
    }
  }

  // WARN LOG
  public warn(message: string, payload?: any, supressDB = false) {
    //if(Config.Environment.NODE_ENV !== 'test')
    this.logger.warn(message);

    if (supressDB !== true) {
      //this.db.dbInterface.logs.create({
      //	service: this.name,
      //	process: this.type,
      //	timestamp: new Date(),
      //	level: 'warning',
      //	message: message,
      //	data: JSON.stringify(payload)
      //});
    }
  }

  // ERROR LOG WITH STACK TRACE
  public error(
    message: string,
    error?: Error,
    save = false,
    account = null,
    client = null
  ) {
    this.logger.error(message + (error ? error.message : ""));

    if (save && this.logRepository) {
      let stack;
      if (error) {
        stack = stackTrace.parse(error);
      } else {
        stack = stackTrace.parse(new Error(message));
      }

      this.logRepository.saveLog({
        service: this.name,
        process: this.type,
        timestamp: new Date(),
        level: "error",
        message: message,
        stacktrace: JSON.stringify(stack),
        accountId: account,
        clientId: client,
      });
    }
  }

  // MAIN LOG FUNCTION
  public log(level: string, message: string, payload?: any) {
    switch (level) {
      case "success":
        this.success(message, payload);
        break;
      case "info":
        this.info(message, payload);
        break;
      case "warn":
        this.warn(message, payload);
        break;
      case "error":
        this.error(message, payload);
        break;
      default:
        this.info(`[SYS: Undefined Log Level ${level}] ${message}`, payload);
    }
  }
}

interface LoggerLabelOptions {
  type: string;
  name: string;
}

interface LoggerOptions {
  label: LoggerLabelOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
// if(Config.Environment.NODE_ENV != 'test')  console.log = function() {}


