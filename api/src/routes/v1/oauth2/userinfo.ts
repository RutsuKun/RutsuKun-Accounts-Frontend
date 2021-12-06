import { Request, Response } from "express";
import { AccountsService } from "@services/AccountsService";

export const GET_UserInfoRoute = async (accountService: AccountsService) => {
    return async (req, res) => {
        if (res.user.logged) {
            const a = await accountService.getAccountInfo(res.user.sub);
            res.status(200).json(a);
        } else {
            res.status(200).json({
                error: "Account doesn't authenticated",
            });
        }
    }
}

export const POST_UserInfoRoute = async (accountService: AccountsService) => {
    return async (req, res) => {
        if (res.user.logged) {
            const a = await accountService.getAccountInfo(res.user.sub);
            res.status(200).json(a);
        } else {
            res.status(200).json({
                error: "Account doesn't authenticated",
            });
        }
    }

}