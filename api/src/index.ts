import "module-alias/register";
import * as dotenv from "dotenv";
import { Terminal } from "./terminal";
import path from "path";

const env =
  process.argv.find((arg) => arg.startsWith("--env=")).replace("--env=", "") ||
  "development";
const envPath =
  env === "production"
    ? path.join(__dirname, "..", `.env`)
    : path.join(__dirname, "..", `${env}.env`);
dotenv.config({ path: envPath });

setTimeout(() => {
  const app = require("./app");
  const appInstance = new app.App();

  if (process.argv[2] == "monitor") {
    appInstance.on("SystemInit", () => {
      const term = new Terminal(appInstance);
      term.init();
    });
  }

  appInstance.init();
}, 2000);
