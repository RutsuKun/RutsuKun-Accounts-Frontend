
import { Middleware, Next, Req, Res, Inject, InjectorService } from '@tsed/common';
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { TokenService } from '@services/TokenService';

@Middleware()
export class AccessTokenMiddleware {

  private tokenService: TokenService;


  @Inject()
  injector: InjectorService;

  constructor() { }

  $onInit() {
    this.tokenService = this.injector.get<TokenService>(TokenService);
  }

  use(@Req() req: Req, @Res() res: Res, @Next() next: Next) {
    let tokenInHeader;
    let tokenInBody;
    let tokenInQuery;
    const tokenHeader = req.headers.authorization;
    const tokenBody = req.body.access_token;
    const tokenQuery = req.query.access_token;

    if (!tokenQuery) {
      tokenInQuery = false;
    } else {
      const bearer = tokenQuery as string;
      if (bearer) {
        try {

          const decoded: any = this.tokenService.verifyAccessToken(bearer);

          res.user = {
            logged: true,
            sub: decoded.sub,
            audience: decoded.aud,
            scope: decoded.scp
          };
          return next();
        } catch (err) {
          //console.log(new Error(err));
          tokenInHeader = false;
        }
      }
    }

    if (!tokenHeader) {
      tokenInHeader = false;
    } else {
      const bearer = tokenHeader.split(' ')[1] || null;
      if (bearer) {
        try {
          const decoded: any = this.tokenService.verifyAccessToken(bearer);

          res.user = {
            logged: true,
            sub: decoded.sub,
            audience: decoded.aud,
            scope: decoded.scp
          };
          return next();
        } catch (err) {
          //console.log(new Error(err));
          tokenInHeader = false;
        }

      }
    }

    if (!tokenBody) {
      tokenInBody = false;
    } else {
      try {
        const decoded: any = this.tokenService.verifyAccessToken(tokenBody);
        res.user = {
          logged: true,
          sub: decoded.sub
        };

      } catch (err) {
        //console.log(new Error(err));
        tokenInBody = false;
      }
    }

    if (!tokenInHeader && !tokenInBody) {
      return res.status(401).json({ code: 401, error: "Unauthorized" });
    }

    console.log('AccessTokenMiddleware.tokenInHeader', tokenInHeader);
    console.log('AccessTokenMiddleware.tokenInBody', tokenInBody);
    next();


  }
}

export function ScopesCheck(expectedScopes, options?) {
  if (!Array.isArray(expectedScopes)) {
    throw new Error(
      'Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)'
    );
  }

  return (req, res, next) => {
    if (!res.user) res.status(401).json({ code: 401, error: "Unauthorized" });

    const error = res => {
      const err_message = 'Insufficient scope';

      if (options && options.failWithError) {
        return next({
          statusCode: 403,
          error: 'Forbidden',
          message: err_message
        });
      }

      res.append(
        'WWW-Authenticate',
        `Bearer scope="${expectedScopes.join(' ')}", error="${err_message}"`
      );
      res.status(403).send(err_message);
    };
    if (expectedScopes.length === 0) {
      return next();
    }

    let userScopes = [];
    let scopeKey = 'scope';
    if (
      options &&
      options.customScopeKey != null &&
      typeof options.customScopeKey === 'string'
    ) {
      scopeKey = options.customScopeKey;
    }
    let userKey = 'user';
    if (
      options &&
      options.customUserKey != null &&
      typeof options.customUserKey === 'string'
    ) {
      userKey = options.customUserKey;
    }


    if (!res[userKey]) {
      return error(res);
    }

    if (typeof res[userKey][scopeKey] === 'string') {
      userScopes = res[userKey][scopeKey].split(' ');
    } else if (Array.isArray(res[userKey][scopeKey])) {
      userScopes = res[userKey][scopeKey];
    } else {
      return error(res);
    }

    let allowed;
    if (options && options.checkAllScopes) {
      allowed = expectedScopes.every(scope => userScopes.includes(scope));
    } else {
      allowed = expectedScopes.some(scope => userScopes.includes(scope));
    }

    console.log("EXPECTED SCOPES: ", expectedScopes);
    console.log("USER SCOPES: ", userScopes);
    console.log("ALLOWED: ", allowed);

    return allowed ? next() : error(res);
  };
};

export function TokenCheck(req: Request, res: Response, next?: NextFunction) {
  return new Promise((resolve, reject: (error: Error) => void) => {
    const token = req.headers.authorization;

    if (!token) {
      next();
      return reject(new Error('No token provided'))
    };

    const bearer = token.split(' ')[1] || null;
    if (bearer) {

      try {
        const decoded = jwt.verify(bearer, 'SpiritWorker1337');
        const {
          sub
        } = decoded;

      } catch (err) {
        return reject(new Error(err));
      }
    }
  });
}

export function AccessTokenCheck(tokenService: TokenService, req: Request, res: Response, next: NextFunction) {
  let tokenInHeader;
  let tokenInBody;
  let tokenInQuery;
  const tokenHeader = req.headers.authorization;
  const tokenBody = req.body.access_token;
  const tokenQuery = req.query.access_token;

  if (!tokenQuery) {
    tokenInQuery = false;
  } else {
    const bearer = tokenQuery as string;
    if (bearer) {
      try {

        const decoded: any = tokenService.verifyAccessToken(bearer);

        res.user = {
          logged: true,
          sub: decoded.sub,
          audience: decoded.aud,
          scope: decoded.scp
        };
        return next();
      } catch (err) {
        //console.log(new Error(err));
        tokenInHeader = false;
      }
    }
  }

  if (!tokenHeader) {
    tokenInHeader = false;
  } else {
    const bearer = tokenHeader.split(' ')[1] || null;
    if (bearer) {
      try {
        const decoded: any = tokenService.verifyAccessToken(bearer);

        res.user = {
          logged: true,
          sub: decoded.sub,
          audience: decoded.aud,
          scope: decoded.scp
        };
        return next();
      } catch (err) {
        //console.log(new Error(err));
        tokenInHeader = false;
      }

    }
  }

  if (!tokenBody) {
    tokenInBody = false;
  } else {
    try {
      const decoded: any = tokenService.verifyAccessToken(tokenBody);
      res.user = {
        logged: true,
        sub: decoded.sub
      };

    } catch (err) {
      //console.log(new Error(err));
      tokenInBody = false;
    }
  }

  if (!tokenInHeader && !tokenInBody) {
    return res.status(401).json({ code: 401, error: "Unauthorized" });
  }

  next();

}

export function AccessTokenCheckInBody(tokenService: TokenService, req: Request, res: Response, next: NextFunction) {
  const { access_token } = req.body;
  if (!access_token) {
    if (!res.user || !res.user.logged) {
      res.user = {
        logged: false
      };
    }
    next();
    return;
  }

  try {

    const decoded: any = tokenService.verifyAccessToken(access_token);

    res.user = {
      logged: true,
      sub: decoded.sub
    };
    next();
  } catch (err) {
    console.log(new Error(err));
    res.user = {
      logged: false
    };
    next();
  }

}


export function TokenAuthCheck(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    res.user = {
      logged: false
    };
    next();
    return;
  }

  const bearer = token.split(' ')[1] || null;
  if (bearer) {
    try {
      const decoded = jwt.verify(bearer, 'Auth Secret');
      res.user = {
        logged: true,
        sub: decoded.sub
      };
      next();
    } catch (err) {
      console.log(new Error(err));
      res.user = {
        logged: false
      };
      next();
    }

  }
}
