import { Controller } from "@tsed/di";
import { Delete, Get, Post, Put } from "@tsed/schema";
import { BodyParams, Context, Logger, PathParams, Req, Res, Use, UseBefore } from "@tsed/common";

import { SessionService } from "@services/SessionService";
import { SessionMiddleware } from "@middlewares/session.middleware";
import { AccountsService } from "@services/AccountsService";
import { generateDataURLQRCode, HTTP, HTTPCodes } from "@utils";
import { AuthenticationMethods } from "common/interfaces/authentication.interface";
import { AccountAuthnMethod } from "@entities/AccountAuthnMethod";

import { Config } from "@config";

import * as speakeasy from "speakeasy";


@Controller("/me/authn")
export class MeAuthnRoute {

  constructor(private accountsService: AccountsService) {}

  @Get("/")
  @UseBefore(SessionMiddleware)
  public async getSessionMeAuthn(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @Context("logger") logger: Logger
  ) {
    if (session && session.getUser) {
      const methods = await this.accountsService.getAccountAuthnMethods(
        session.getUser.id
      );
      response.status(200).json({
        methods: methods.map((method)=>{
          delete method.data;
          return method;
        })
    });
    } else {
      HTTP.Unauthorized(request, response, logger);
    }
  }

  @Get("/:method")
  @Use(SessionMiddleware)
  public async getMeAuthnStatus(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @PathParams("method") method: AuthenticationMethods,
    @Context("logger") logger: Logger
  ) {

    if(Config.AUTHN.supported_authn_methods.includes(method)) {
      logger.info(`Authn Method '${method}' supported`)
      if (session && session.getUser) {
        const found = await this.accountsService.getAccountAuthnMethod(
          session.getUser.id,
          method
        );
        delete found.data;
        response.status(200).json({ method: found ? found : null });
      } else {
        HTTP.Unauthorized(request, response, logger);
      }
    } else {
      logger.info(`Authn Method '${method ? method : null}' not supported`)
      HTTP.BadRequest(`Authn Method '${method ? method : null}' not supported`, request, response, logger);
    }


  }

  @Post("/:method/init-flow")
  @Use(SessionMiddleware)
  public async postMeAuthnStartFlow(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @PathParams("method") method: AuthenticationMethods,
    @Context("logger") logger: Logger
  ) {

    if(Config.AUTHN.supported_authn_methods.includes(method)) {
      logger.info(`Authn Method '${method}' supported`)
      if (session && session.getUser) {
        const found = await this.accountsService.getAccountAuthnMethod(
          session.getUser.id,
          method
        );

        if(found && found.enabled) {
          return HTTP.BadRequest('Authentication method already enabled', request, response, logger);
        } else if(found && !found.enabled) {
          const otpauth_url = speakeasy.otpauthURL({
            secret: found.data["secret"],
            encoding: 'base32',
            label: `${session.getUser.username} - RutsuKun Accounts`,
            issuer: Config.OAUTH2.issuer,
          });
          const qrcode = await generateDataURLQRCode(otpauth_url)
          return response.status(200).json({
            qrcode: qrcode,
            url: otpauth_url,
            secret: found.data.secret
          });
        } else {
          switch (method.toUpperCase() as AuthenticationMethods) {
            case "OTP":
               const { base32, ascii } = speakeasy.generateSecret({
                name: `${session.getUser.username} - RutsuKun Accounts`,
                issuer: Config.OAUTH2.issuer,
                length: 40
              });


              

              const otpauth_url = speakeasy.otpauthURL({
                secret: base32,
                encoding: 'base32',
                label: `${session.getUser.username} - RutsuKun Accounts`,
                issuer: Config.OAUTH2.issuer,
              });
      
              const account = await this.accountsService.getAccountByUUID(session.getUser.id);

              const authnMethod = new AccountAuthnMethod({
                type: 'OTP',
                enabled: false,
                data: {
                  secret: base32
                },
                account: account
              });

              this.accountsService.addAccountAuthnMethod(authnMethod);

              const qrcode = await generateDataURLQRCode(otpauth_url)

              return response.status(200).json({
                qrcode: qrcode,
                url: otpauth_url,
                secret: base32
              });
      
              break;
          
            default:
              break;
          }
        }

      } else {
        return HTTP.Unauthorized(request, response, logger);
      }
    } else {
      logger.info(`Authn Method '${method ? method : null}' not supported`)
      return HTTP.BadRequest(`Authn Method '${method ? method : null}' not supported`, request, response, logger);
    }


  }


  @Put("/:method/finish-flow")
  @Use(SessionMiddleware)
  public async postMeAuthnFinishFlow(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @PathParams("method") method: AuthenticationMethods,
    @Context("logger") logger: Logger,
    @BodyParams("code") code: string
  ) {

    if(Config.AUTHN.supported_authn_methods.includes(method)) {
      logger.info(`Authn Method '${method}' supported`)
      if (session && session.getUser) {
        const found = await this.accountsService.getAccountAuthnMethod(
          session.getUser.id,
          method
        );

        if(found && found.enabled) {
          return HTTP.BadRequest('Authentication method already enabled', request, response, logger);
        } else if(found && !found.enabled) {


          switch (method.toUpperCase() as AuthenticationMethods) {
            case "OTP":

              const verified = speakeasy.totp.verify({
                secret: found.data.secret,
                encoding: 'base32',
                token: code,
              });

              if(!verified) return HTTP.BadRequest('OTP code invalid', request, response, logger);

              found.enabled = true;

              this.accountsService.addAccountAuthnMethod(found);

              return response.status(200).json({
                status: "success"
              });
      
              break;
          
            default:
              break;
          }


        } else {

        }

      } else {
        return HTTP.Unauthorized(request, response, logger);
      }
    } else {
      logger.info(`Authn Method '${method ? method : null}' not supported`)
      return HTTP.BadRequest(`Authn Method '${method ? method : null}' not supported`, request, response, logger);
    }


  }

  @Delete("/:method/disable")
  @Use(SessionMiddleware)
  public async postMeAuthnDisable(
    @Req() request: Req,
    @Res() response: Res,
    @Context("session") session: SessionService,
    @PathParams("method") method: AuthenticationMethods,
    @Context("logger") logger: Logger
  ) {

    if(Config.AUTHN.supported_authn_methods.includes(method)) {
      logger.info(`Authn Method '${method}' supported`)
      if (session && session.getUser) {
        const found = await this.accountsService.getAccountAuthnMethod(
          session.getUser.id,
          method
        );

        if(!found) return HTTP.BadRequest('Authentication method not exists', request, response, logger);

        delete found.data;

        if(found && found.enabled) {
 
          const { affected } = await this.accountsService.removeAccountAuthnMethod(found)

          if(affected) {
            return response.status(HTTPCodes.OK).json({ status: "success"});
          } else {
            return HTTP.BadRequest('Authentication method not exists', request, response, logger);
          }

        }

      } else {
        return HTTP.Unauthorized(request, response, logger);
      }
    } else {
      logger.info(`Authn Method '${method ? method : null}' not supported`)
      return HTTP.BadRequest(`Authn Method '${method ? method : null}' not supported`, request, response, logger);
    }


  } 
}
