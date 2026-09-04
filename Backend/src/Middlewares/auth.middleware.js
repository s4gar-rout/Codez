import { verifyAccessToken } from "../Utils/token.utils.js";

export const authMiddleware = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = verifyAccessToken(accessToken);

        if (decoded.type !== "access") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        req.user = {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};