import Redis from "ioredis";
import { env } from "../Configs/config.js";
const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,

    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
});

redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (error) => {
    console.error("Redis error:", error.message);
});

redis.on("close", () => {
    console.log("Redis connection closed");
});

export default redis;