import { deleteUserAccount } from "../Services/account.service.js";

export const deleteAccountController = async (
    req,
    res,
    next
) => {
    try {
        await deleteUserAccount({
            userId: req.user.userId,
            sessionId: req.user.sessionId,
        });

        // Clear authentication cookies
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
            message: "Account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};