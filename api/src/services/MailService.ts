import * as nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { Injectable } from "@tsed/di";
import { Config } from "@config";

@Injectable()
export class MailService {
  private running = false;
  private options;
  private mailer: any;
  constructor() {
    this.options = {
      pool: true,
      debug: false,
      logger: false,
      host: Config.Mail.host,
      port: Config.Mail.port,
      secure: false,
      auth: {
        user: Config.Mail.user,
        pass: Config.Mail.pass,
      },
      ignoreTLS: true,
    };
  }

  public healthy() {
    const ctx = this;
    // ctx.logger.info('Requested Mail Component Healthy Check');
    const healthy = {
      name: "Mail",
      slug: "mail",
      healthy: ctx.running,
    };
    return healthy;
  }

  public sendAccountVerificationEmail(email, username, token): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve, reject) => {
      const url = `${Config.FRONTEND.url}/verify-email?code=${token}`;

      ejs
        .renderFile(
          path.join(process.cwd(), "src", "views", "welcome.email.ejs"),
          {
            username: username,
            url: url,
          }
        )
        .then((result) => {
          const mailOptions = {
            sender: "Account - Raining Dreams",
            from: "Raining Dreams <account@rainingdreams.to>",
            to: username + " <" + email + ">",
            subject: "Confirm your Raining account",
            text:
              "Your account has been created.\r\nAccount information:\r\nUsername: " +
              username +
              "\r\nEmail: " +
              email +
              "\r\n\r\nAccount confirmation link: https://auth.rainingdreams.to/confirm-email?code=" +
              token +
              "\r\nThe link is valid for 24 hours.\r\n\r\nEnjoy using our services, Raining Dreams",
            html: result,
          };

          ctx.sendMail(mailOptions);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async sendMail(options: MailOptions) {
    const info = await this.mailer.sendMail(options);

    console.log(info);
  }
}

export interface MailOptions {
  sender: string;
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
}
