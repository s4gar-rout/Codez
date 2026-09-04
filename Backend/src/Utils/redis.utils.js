import redis from "../Configs/redis.js";

export const setRedis = async (
    key,
    value,
    expiryInSeconds
) => {
    await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        expiryInSeconds
    );
};

export const getRedis = async (key) => {
    const data = await redis.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
};

export const deleteRedis = async (key) => {
    await redis.del(key);
};

export const incrementRedis = async (key) => {
    return await redis.incr(key);
};

export const expireRedis = async (
    key,
    expiryInSeconds
) => {
    await redis.expire(key, expiryInSeconds);
};