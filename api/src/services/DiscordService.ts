
import * as discordbot from "discord.js";
import { Injectable } from "@tsed/di";

import { LoggerService } from "@services/LoggerService";
import { Config } from "@config";

@Injectable()
export class DiscordService {
  private running: boolean;
  private token: string = null;
  private discord;

  constructor(private loggerService: LoggerService) {
    this.loggerService = this.loggerService.child({
      label: {
        type: "discord",
        name: "Discord Bot",
      },
    });
    this.token = Config.Discord.token;
  }

  // INIT DISCORD COMPONENT
  public init() {
    const ctx = this;
    return new Promise<void>((resolve) => {
      ctx.loggerService.info("Initializing Discord");
      ctx.startBot(ctx.token).then(() => {
        ctx.running = true;
        ctx.loggerService.success("Discord Initialized");
        resolve();
      });
    });
  }

  // STOP DISCORD COMPONENT
  public stop() {
    const ctx = this;
    return new Promise<void>((resolve) => {
      ctx.loggerService.info("Stopping Discord");
      ctx.stopBot();
      ctx.running = false;
      ctx.loggerService.success("Discord stopped successfully");
      resolve();
    });
  }

  public healthy() {
    const ctx = this;
    ctx.loggerService.info("Requested Discord Component Healthy Check");
    const healthy = {
      name: "Discord",
      slug: "discord",
      healthy: ctx.running,
    };
    return healthy;
  }

  // START DISCORD BOT
  public async startBot(token: string) {
    const ctx = this;
    return new Promise<void>((resolve) => {
      this.loggerService.info("Starting discord bot");
      const discord = new discordbot.Client();
      discord.on("message", async (msg) => {
        //if (msg.content === 'c') {
        //this.createVerificationMessage("756975842625585170");
        //}
        if (msg.content === "c") {
          this.initStatusEmbed();
        }
        if (msg.content === "ping") {
          msg.reply("Pong!");
        }
        if (msg.content === "r!service discord stop") {
          const embed = ctx.createEmbed(
            "Stoped Discord Service",
            null,
            "ce0118",
            null
          );
          await msg.channel.send({ embed });
          ctx.stop();
        }
        if (msg.content === "r!service status") {
          const fields = [
            { name: "Database Service", value: "Online" },
            { name: "Mail Service", value: "Online" },
            { name: "Settings Service", value: "Online" },
            { name: "Client Service", value: "Online" },
            { name: "Account Service", value: "Online" },
            { name: "Token Service", value: "Online" },
            { name: "Auth Service", value: "Online" },
            { name: "Discord Service", value: "Online" },
            { name: "Express Service", value: "Online" },
            { name: "Cdn Service", value: "Online" },
          ];
          const embed = ctx.createEmbed(
            "Status of Services",
            null,
            "00931f",
            fields
          );
          msg.channel.send({ embed });
        }
      });
      discord.login(token).then(() => {
        this.discord = discord;

        // setTimeout(() => {
        //     this.updatePresence();
        //     this.updateStatusEmbed();
        // }, 3000);

        // setInterval(() => {
        //     this.updatePresence();
        //     this.updateStatusEmbed();
        // }, 60000);

        this.loggerService.info("Started discord bot");
        resolve();
      });
    });
  }

  public stopBot() {
    this.discord.user.setStatus("offline");
    this.discord.destroy();
  }

  async updatePresence() {
    // const users = await this.account.listAccounts();
    // this.discord.user.setActivity('API Version: v1-dev, Total registered accounts: ' + users.length, {
    //     url: 'https://rainingdreams.to',
    //     type: 'STREAMING'
    // });
  }

  initStatusEmbed() {
    // const fields = [
    //     { "name": "API Status", "value": "Online" },
    //     { "name": "Accounts", "value": "2137" },
    //     { "name": "Clients", "value": "2137" }
    // ];
    // const embed = this.createEmbed(null, null, 4071065, fields, null, "Raining Dreams Status")
    // this.sendMessageToChannel("737765585735385210", embed);
  }

  async updateStatusEmbed() {
    // const allUsers = await this.account.listAccounts() || null;
    // const adminUsers = await this.account.getAccountsByRole('admin') || null;
    // const usersUsers = await this.account.getAccountsByRole('user') || null;
    // const allClients = await this.client.getClients() || null;
    // const usedRam = process.memoryUsage().heapUsed / 1024 / 1024;
    // const fields = [
    //     { "name": "API Status", "value": "Online" },
    //     { "name": "Accounts", "value": allUsers.length || "0" },
    //     { "name": "Normal users", "value": usersUsers.length || "0" },
    //     { "name": "Admins", "value": adminUsers.length || "0" },
    //     { "name": "Clients", "value": allClients.length || "0" },
    //     { "name": "RAM", "value": Math.round(usedRam) + " MB" }
    // ];
    // const embed = this.createEmbed(null, null, 4071065, fields, null, "Raining Dreams Status")
    // this.updateMessageInChannel("737765585735385210", "761016114384994305", embed);
  }

  public sendMessageToChannel(channelId, embed) {
    // this.discord.guilds.cache.get("702666601757147237").channels.cache.get(channelId).send({ embed });
  }

  public updateMessageInChannel(channelId, messageId, embed) {
    // this.discord.guilds.cache.get("702666601757147237")
    //     .channels.cache.get(channelId)
    //     .messages.fetch(messageId).then((message) => {
    //         message.edit({ embed });
    //     });
  }

  public getAvatar() {
    const bot_avatar =
      "https://cdn.discordapp.com/avatars/" +
      this.discord.user.id +
      "/" +
      this.discord.user.avatar +
      ".png";
    return bot_avatar;
  }

  public createEmbed(
    title,
    description,
    color,
    fields?,
    thumbnail?,
    authorName?,
    authorUrl?,
    authorAvatar?
  ) {
    const bot_avatar =
      "https://cdn.discordapp.com/avatars/" +
      this.discord.user.id +
      "/" +
      this.discord.user.avatar +
      ".png";

    const embed = {
      title: title,
      description: description,
      color: color,
      timestamp: Date.now(),
      footer: {
        icon_url: bot_avatar,
        text: "Raining Dreams",
      },
      thumbnail: {
        url: thumbnail,
      },
      author: {
        name: authorName || "Raining Dreams DEV",
        url: authorUrl || "https://rainingdreams.to",
        icon_url: authorAvatar || bot_avatar,
      },
      fields: fields,
    };
    return embed;
  }
}
