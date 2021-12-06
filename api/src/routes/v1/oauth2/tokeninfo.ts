import { Request, Response } from "express";

export const GET_TokenInfoRoute = (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'todo'
    });
}

export const POST_TokenInfoRoute = (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'todo'
    });
}