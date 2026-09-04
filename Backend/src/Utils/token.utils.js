import jwt from "jsonwebtoken";
import { env } from "../Configs/config.js";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
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