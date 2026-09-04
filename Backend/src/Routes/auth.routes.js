import { Router } from "express";

import { registerController } from "../Controllers/auth.controllers.js";
import { validateRequest } from "../Middlewares/validate.middleware.js";
import { registerValidator } from "../Validators/auth.validators.js";

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

export default router;