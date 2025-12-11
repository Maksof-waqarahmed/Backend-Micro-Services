import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import rateLimit from 'express-rate-limit';
import { logger } from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import { RedisStore, type RedisReply } from 'rate-limit-redis'

const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on("error", (err) => {
    logger.warn("Error while connecting to Redis client", err);
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate-limit",
    points: 100,
    duration: 60,
});

export const globalRateLimiter = async function globalLimiter(req: Request, res: Response, next: NextFunction) {
    try {
        await rateLimiter.consume(req.ip || '');
        return next();
    } catch (error) {
        logger.warn("Rate limit exceeded", { ip: req.ip });
        return res.status(429).json({
            success: false,
            message: "Too many requests, slow down!",
        });
    }
}

export const registerRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        logger.warn('Sensitive endpoint rate limit exceeded for IP:', req.ip);
        return res.status(429).json({
            success: false,
            message: "Too many requests, slow down!",
        });
    },
    store: new RedisStore({
        sendCommand: (command: string, ...args: string[]) => redisClient.call(command, ...args) as Promise<RedisReply>,
    }),
});

