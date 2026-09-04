import User from "../Models/user.model.js";

import {
    createAndSendForgotPasswordOtp,
    verifyForgotPasswordOtp,
} from "../Services/verification.service.js";

export const forgotPasswordController = async (
    req,
    res,
    next
) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, a password reset OTP has been sent",
            });
        }

        await createAndSendForgotPasswordOtp({
            user,
        });

        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a password reset OTP has been sent",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPasswordController = async (
    req,
    res,
    next
) => {
    try {
        const {
            email,
            otp,
            newPassword,
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or OTP",
            });
        }

        await verifyForgotPasswordOtp({
            user,
            otp,
        });

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};