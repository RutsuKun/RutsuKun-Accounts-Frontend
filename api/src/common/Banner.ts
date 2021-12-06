import * as Figlet from "figlet";
import chalk from "chalk";
import { NodeEnvironment, Config } from "@config";

export const showBanner = (): void => {
  console.log(Figlet.textSync("RutsuKun Accounts"));
  console.log();
  console.log(
    `${chalk.bold("RutsuKun Accounts")} - ${chalk.italic(
      `ver. ${Config.appPackageInfo.version}`
    )}`
  );
  console.log(chalk.cyan(chalk.underline(Config.appPackageInfo.repository)));
  console.log();
  console.log(`Copyright © 2021 by ${Config.appPackageInfo.author}`);
  console.log(
    `Built with ${chalk.redBright("<3")} by ${chalk.cyan("Rutsu")}${chalk.blue(
      "Kun"
    )}`
  );
  console.log();
  console.log("Distributed under " + chalk.bold("Unlicense"));
  console.log();
};

export const devModeCheck = (): void => {
  if (Config.Environment.NODE_ENV === NodeEnvironment.Local) {
    console.log(
      chalk.yellow("Launching in LOCAL mode, ") +
        chalk.bgYellowBright(
          chalk.black(chalk.bold(" DO NOT USE THIS IN PRODUCTION. "))
        )
    );
    console.log();
  }

  if (Config.Environment.NODE_ENV === NodeEnvironment.Development) {
    console.log(
      chalk.yellow("Launching in DEVELOPMENT mode, ") +
        chalk.bgYellowBright(
          chalk.black(chalk.bold(" DO NOT USE THIS IN PRODUCTION. "))
        )
    );
    console.log();
  }

  if (Config.Environment.NODE_ENV === NodeEnvironment.Staging) {
    console.log(chalk.yellow("Launching in STAGING mode."));
    console.log();
  }

  if (Config.Environment.NODE_ENV === NodeEnvironment.Production) {
    console.log(chalk.yellow("Launching in PRODUCTION mode."));
    console.log();
  }
};
