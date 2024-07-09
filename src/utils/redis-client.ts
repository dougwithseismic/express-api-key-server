// @@filename: src/utils/redis-client.ts
import Redis from "ioredis";
import { logger } from "../config/logger";

const redisClient = new Redis(
  `redis://default:OUjTwcheYBMnLzJQOXuxkMoVkYraxZEl@monorail.proxy.rlwy.net:25193`
);
// const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

export const redis = redisClient;
