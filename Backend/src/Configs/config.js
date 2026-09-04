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

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};