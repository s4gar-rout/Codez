import dns from "dns";
dns.setServers(["8.8.8.8"]);
import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./Configs/db.js";
dotenv.config();
connectDatabase();

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CODEZ API is running 🚀",
    });
});

app.listen(PORT, () => {
    console.log(`🚀 CODEZ server running on port ${PORT}`);
});