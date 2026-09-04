import { registerUser } from "../Services/auth.service.js";



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



