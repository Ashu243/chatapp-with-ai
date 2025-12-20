import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "../services/redis.services.js";

export const loginRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    points: 5, // Number of points
    duration: 5 * 60, // Per second(s)
})