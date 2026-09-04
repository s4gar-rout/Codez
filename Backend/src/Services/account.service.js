import User from "../Models/user.model.js";
import { deleteRedis } from "../Utils/redis.utils.js";

export const deleteUserAccount = async ({
    userId,
    sessionId,
}) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // Delete user from MongoDB
    await User.findByIdAndDelete(userId);

    // Delete current session from Redis
    if (sessionId) {
        await deleteRedis(`session:${sessionId}`);
    }
};