import dns from "dns";
dns.setServers(["8.8.8.8"]);
import app from "./app.js";
import { connectDatabase } from "./Configs/db.js";
import redis from "./Configs/redis.js";
import { env } from "./Configs/config.js";


const startServer = async () => {
    try {
        await connectDatabase();

        await redis.connect();

        app.listen(env.PORT, () => {
            console.log(`CODEZ server running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();