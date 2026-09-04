import User from "../Models/user.model.js";

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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

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

    const accessToken = generateAccessToken(user._id);

    return accessToken;
};