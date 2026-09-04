import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

// Importing the error middleware
import {
    errorMiddleware,
    notFoundMiddleware,
} from "./Middlewares/error.middleware.js";

const app = express();

// Security
app.use(helmet());

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

export default app;