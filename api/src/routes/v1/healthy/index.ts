import { Controller, Get } from '@tsed/common';
import { Request, Response } from 'express';



@Controller('/healthy')
export class HealthyRoute {

	constructor() { }

	@Get()
	public async healthy(req: Request, res: Response) {
		return res.status(200).json([
			// this.database.healthy(),
			// this.mail.healthy(),
			// this.settings.healthy(),
			// this.scope.healthy(),
			// this.client.healthy(),
			// this.token.healthy(),
			// this.account.healthy(),
			// this.discord.healthy(),
			// this.auth.healthy(),
		]);
	}

	@Get('/:componentId')
	public async healthyComponent(req: Request, res: Response) {
		const component = req.params.componentId;
		// switch (component) {
		// 	case "database":
		// 		res.status(200).json(this.database.healthy());
		// 		break;
		// 	case "mail":
		// 		res.status(200).json(this.mail.healthy());
		// 		break;
		// 	case "system":
		// 		res.status(200).json(this.settings.healthy());
		// 		break;
		// 	case "scope":
		// 		res.status(200).json(this.scope.healthy());
		// 		break;
		// 	case "client":
		// 		res.status(200).json(this.client.healthy());
		// 		break;
		// 	case "security":
		// 		res.status(200).json(this.token.healthy());
		// 		break;
		// 	case "account":
		// 		res.status(200).json(this.account.healthy());
		// 		break;
		// 	case "auth":
		// 		res.status(200).json(this.auth.healthy());
		// 		break;
		// 	case "discord":
		// 		res.status(200).json(this.discord.healthy());
		// 		break;
		// 	default:
		// 		res.status(200).json({ error: true, message: "Component doesn't exist" });
		// 		break;
		// }
	}
}