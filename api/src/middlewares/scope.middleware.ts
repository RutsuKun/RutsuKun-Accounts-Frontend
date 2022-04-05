import { Config } from "@config";
import {
  Middleware,
  Next,
  Req,
  Res,
} from "@tsed/common";


@Middleware()
export class ScopeMiddleware {
  use(expectedScopes: string[], options?) {
    if (!Array.isArray(expectedScopes)) {
      throw new Error(
        "Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)"
      );
    }

    return (req: Req, res: Res, next: Next) => {
      if (!Config.isProd) {
        res.append(
          "ExpectedScopes",
          `${expectedScopes.join(" ")}`
        );
      }
      if (!res.user) res.status(401).json({ code: 401, error: "Unauthorized" });

      const error = (res) => {
        const err_message = `Insufficient scopes: ${expectedScopes.join(", ")}`;

        if (options && options.failWithError) {
          return next({
            statusCode: 403,
            error: "Forbidden",
            message: err_message,
          });
        }

        res.append(
          "WWW-Authenticate",
          `Bearer scope="${expectedScopes.join(" ")}", error="${err_message}"`
        );
        res.status(403).send(err_message);
      };
      if (expectedScopes.length === 0) {
        return next();
      }

      let userScopes = [];
      let scopeKey = "scope";
      if (
        options &&
        options.customScopeKey != null &&
        typeof options.customScopeKey === "string"
      ) {
        scopeKey = options.customScopeKey;
      }
      let userKey = "user";
      if (
        options &&
        options.customUserKey != null &&
        typeof options.customUserKey === "string"
      ) {
        userKey = options.customUserKey;
      }

      if (!res[userKey]) {
        return error(res);
      }

      if (typeof res[userKey][scopeKey] === "string") {
        userScopes = res[userKey][scopeKey].split(" ");
      } else if (Array.isArray(res[userKey][scopeKey])) {
        userScopes = res[userKey][scopeKey];
      } else {
        return error(res);
      }

      let allowed;
      if (options && options.checkAllScopes) {
        allowed = expectedScopes.every((scope) => userScopes.includes(scope));
      } else {
        allowed = expectedScopes.some((scope) => userScopes.includes(scope));
      }

      console.log("EXPECTED SCOPES: ", expectedScopes);
      console.log("USER SCOPES: ", userScopes);
      console.log("ALLOWED: ", allowed);

      return allowed ? next() : error(res);
    };
  }
}
