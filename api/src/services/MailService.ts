import * as nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { Injectable } from "@tsed/di";
import { Config } from "@config";

@Injectable()
export class MailService {
  private options: any;
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

    this.mailer = nodemailer.createTransport(this.options);
  }

  public sendAccountVerificationEmail(email, username, token): Promise<any> {
    const ctx = this;
    return new Promise(async (resolve, reject) => {
      const url = `${Config.FRONTEND.url}/verify-email?code=${token}`;

      ejs.renderFile(path.join(process.cwd(), "src", "views", "welcome.email.ejs"),
        { username: username, url: url }
        )
        .then((result) => {
          const mailOptions = {
            sender: "Account - RutsuKun Accounts",
            from: "RutsuKun Accounts <accounts@rutsukun.pl>",
            to: username + " <" + email + ">",
            subject: "Confirm your RutsuKun Account",
            text:
              `Your account has been created.\r\n
              Account information:\r\n
              Username: ${username}\r\n
              Email: ${email} \r\n\r\n
              Account confirmation link: ${Config.FRONTEND.url}/confirm-email?code=${token}\r\n
              The link is valid for 24 hours.\r\n\r\n
              Enjoy using our services, RutsuKun Accounts`,
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
