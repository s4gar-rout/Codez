import User from "../Models/user.model.js";

import {
    verifyEmailOtp,
    createAndSendVerificationOtp,
} from "../Services/verification.service.js";


export const verifyEmailController = async (
    req,
    res,
    next
) => {
    try {
        const { email, otp } = req.body;

        const user = await verifyEmailOtp({
            email,
            otp,
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isEmailVerified:
                        user.isEmailVerified,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationController = async (
    req,
    res,
    next
) => {
    try {
        const user = await User.findById(
            req.user.userId
        );

        if (!user) {
            const error = new Error(
                "User not found"
            );

            error.statusCode = 404;

            throw error;
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        await createAndSendVerificationOtp({
            user,
        });

        return res.status(200).json({
            success: true,
            message: "Verification OTP sent successfully",
        });
    } catch (error) {
        next(error);
    }
};