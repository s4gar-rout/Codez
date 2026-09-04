import User from "../Models/user.model.js";
import crypto from "crypto";
import { setRedis,getRedis,deleteRedis } from "../Utils/redis.utils.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../Utils/token.utils.js";

export const registerUser = async ({ username, email, password }) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    }).lean();

    if (existingUser) {
        const field =
            existingUser.email === email ? "Email" : "Username";

        const error = new Error(`${field} already exists`);
        error.statusCode = 409;

        throw error;
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Create unique session for this login/device
    const sessionId = crypto.randomUUID();

    const accessToken = generateAccessToken(
        user._id,
        sessionId
    );

    const refreshToken = generateRefreshToken(
        user._id,
        sessionId
    );

    // Store session in Redis
    await setRedis(
        `session:${sessionId}`,
        {
            userId: user._id.toString(),
            createdAt: new Date().toISOString(),
        },
        7 * 24 * 60 * 60
    );

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshUserToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;
        throw error;
    }

    let decoded;

    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        const authError = new Error("Invalid or expired refresh token");
        authError.statusCode = 401;
        throw authError;
    }

    // Make sure this is actually a refresh token
    if (decoded.type !== "refresh" || !decoded.sessionId) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
    }

    // Check session in Redis
    const session = await getRedis(
        `session:${decoded.sessionId}`
    );

    if (!session) {
        const error = new Error(
            "Session expired or revoked. Please login again"
        );
        error.statusCode = 401;
        throw error;
    }

    // Make sure session belongs to the same user
    if (session.userId !== decoded.userId) {
        const error = new Error("Invalid session");
        error.statusCode = 401;
        throw error;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }

    const accessToken = generateAccessToken(
        user._id,
        decoded.sessionId
    );

    return accessToken;
};


export const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        return;
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);

        if (decoded.sessionId) {
            await deleteRedis(
                `session:${decoded.sessionId}`
            );
        }
    } catch (error) {
        // Token invalid/expired hai to bhi logout successful hona chahiye.
        // Cookies controller mein clear ho jayengi.
    }
};

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId)
        .select(
            "-password -__v"
        )
        .lean();

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};