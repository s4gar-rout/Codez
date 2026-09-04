import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}

if(!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in the environment variables");
}

if(!process.env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
}

if(!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined in the environment variables");
}

if(!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
}

if(!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
}

if(!process.env.ACCESS_TOKEN_EXPIRES_IN) {
    throw new Error("ACCESS_TOKEN_EXPIRES_IN is not defined in the environment variables");
}

if(!process.env.REFRESH_TOKEN_EXPIRES_IN) {
    throw new Error("REFRESH_TOKEN_EXPIRES_IN is not defined in the environment variables");
}

if(!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST is not defined in the environment variables");
}

if(!process.env.REDIS_PORT) {
    throw new Error("REDIS_PORT is not defined in the environment variables");
}

if(!process.env.REDIS_USERNAME) {
    throw new Error("REDIS_USERNAME is not defined in the environment variables");
}

if(!process.env.REDIS_PASSWORD) {
    throw new Error("REDIS_PASSWORD is not defined in the environment variables");
}

if(!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not defined in the environment variables");
}

if(!process.env.BREVO_SENDER_EMAIL) {
    throw new Error("BREVO_SENDER_EMAIL is not defined in the environment variables");
}

if (!process.env.OTP_HASH_SECRET){
    throw new Error("OTP_HASH_SECRET is not defined in the environment variables");
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    OTP_HASH_SECRET: process.env.OTP_HASH_SECRET,
};