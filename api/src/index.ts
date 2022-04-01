import "module-alias/register";
import * as dotenv from "dotenv";
import { Terminal } from "./terminal";
import path from "path";

Array.prototype["unique"] = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

const hasEnv = process.argv.find((arg) => arg.startsWith("--env="));
const env = hasEnv ? hasEnv.replace("--env=", "") : null;

if (env) {
  const envPath = env === "production" ? path.join(__dirname, "..", `.env`) : path.join(__dirname, "..", `${env}.env`);
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}


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
