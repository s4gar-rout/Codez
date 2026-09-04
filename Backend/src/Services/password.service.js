import User from "../Models/user.model.js";

export const changeUserPassword = async ({
    userId,
    currentPassword,
    newPassword,
}) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid =
        await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
        const error = new Error(
            "Current password is incorrect"
        );

        error.statusCode = 401;
        throw error;
    }

    if (currentPassword === newPassword) {
        const error = new Error(
            "New password must be different from current password"
        );

        error.statusCode = 400;
        throw error;
    }

    user.password = newPassword;

    await user.save();
};