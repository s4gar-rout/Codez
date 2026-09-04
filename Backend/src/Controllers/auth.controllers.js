import {
    registerUser,
    loginUser,
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
 * @POST api/auth/
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

