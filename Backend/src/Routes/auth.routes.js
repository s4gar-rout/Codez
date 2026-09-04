import { Router } from "express";

import { registerController,loginController,refreshTokenController,logoutController,getCurrentUserController } from "../Controllers/auth.controllers.js";
import { validateRequest } from "../Middlewares/validate.middleware.js";
import { registerValidator,loginValidator,verifyEmailValidator,forgotPasswordValidator,resetPasswordValidator,changePasswordValidator } from "../Validators/auth.validators.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";
import {
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
} from "../Controllers/password.controller.js";
import {
    verifyEmailController,
    resendVerificationController,
} from "../Controllers/verification.controller.js";



const router = Router();


/**
 * @POST api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post(
    "/register",
    registerValidator,
    validateRequest,
    registerController
);

/**
 * @POST api/auth/login
 * @description Login an existing user
 * @access Public
 */
router.post("/login", loginValidator, validateRequest, loginController);


/**
 * 
 * 
 */
router.post(
    "/refresh-token",
    refreshTokenController
);



/**
 * 
 * 
 */
router.post(
    "/logout",
    logoutController
);



router.get(
    "/me",
    authMiddleware,
    getCurrentUserController
);


router.post(
    "/verify-email",
    verifyEmailValidator,
    validateRequest,
    verifyEmailController
);
router.post(
    "/resend-verification",
    authMiddleware,
    resendVerificationController
);


router.post(
    "/forgot-password",
    forgotPasswordValidator,
    validateRequest,
    forgotPasswordController
);

router.post(
    "/reset-password",
    resetPasswordValidator,
    validateRequest,
    resetPasswordController
);


router.post(
    "/change-password",
    authMiddleware,
    changePasswordValidator,
    validateRequest,
    changePasswordController
);
export default router;