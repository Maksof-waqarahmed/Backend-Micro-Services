import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function logingMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info(`Request: ${req.method} request to ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
}