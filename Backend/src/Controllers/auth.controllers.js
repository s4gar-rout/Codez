import {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    getCurrentUser,
} from "../Services/auth.service.js";



/**
 * @POST api/auth/register
 * @description Register a new user
 * @access Public
 */
export const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await registerUser({
            username,
            email,
            password,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @POST api/auth/login
 * @description Login a user
 * @access Public
 * 
 */

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken } = await loginUser({
            email,
            password,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};


/**
 * 
 * 
 */
export const refreshTokenController = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        const accessToken = await refreshUserToken(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @POST
 * 
 */
export const logoutController = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        await logoutUser(refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserController = async (req, res, next) => {
    try {
        const user = await getCurrentUser(req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};