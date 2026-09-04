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

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URI: process.env.MONGO_URI,
};