import { Router } from "express";

import { registerController,loginController,refreshTokenController,logoutController,getCurrentUserController } from "../Controllers/auth.controllers.js";
import { validateRequest } from "../Middlewares/validate.middleware.js";
import { registerValidator,loginValidator,verifyEmailValidator } from "../Validators/auth.validators.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";
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
export default router;