import User from "../Models/user.model.js";

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