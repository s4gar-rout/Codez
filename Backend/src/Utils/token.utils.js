import jwt from "jsonwebtoken";
import { env } from "../Configs/config.js";
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN || "15m",
        }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN || "7d",
        }
    );
};