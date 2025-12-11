import mongoose from "mongoose";
import { logger } from "../utils/logger";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        logger.info("✅ Database connected successfully!");
    } catch (error) {
        logger.warn("❌ Error connecting to database:", error);
        process.exit(1);
    }
}
