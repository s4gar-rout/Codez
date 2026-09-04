import { Router } from "express";

import { registerController,loginController } from "../Controllers/auth.controllers.js";
import { validateRequest } from "../Middlewares/validate.middleware.js";
import { registerValidator,loginValidator } from "../Validators/auth.validators.js";

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

export default router;