import jwt from "jsonwebtoken";
import { env } from "../Configs/config.js";

export const generateAccessToken = (
    userId,
    sessionId,
    role
) => {
    return jwt.sign(
        {
            userId: userId.toString(),
            sessionId,
            role,
            type: "access",
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
};

export const generateRefreshToken = (
    userId,
    sessionId
) => {
    return jwt.sign(
        {
            userId: userId.toString(),
            sessionId,
            type: "refresh",
        },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    );
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET
    );
};