import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./Routes/auth.routes.js";

import {
    errorMiddleware,
    notFoundMiddleware,
} from "./Middlewares/error.middleware.js";

const app = express();

// Security
app.use(helmet());

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

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware - ALWAYS LAST
app.use(notFoundMiddleware);
app.use(errorMiddleware);


// Health check endpoint

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CODEZ API is running 🚀",
    });
});

export default app;