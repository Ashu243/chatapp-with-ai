import { RateLimiterRedis } from "rate-limiter-flexible"
import redis from "../services/redis.services.js"

export const aiRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "ai_limit",
  points: 5,     // 5 AI requests
  duration: 60,  // per 60 seconds
})
