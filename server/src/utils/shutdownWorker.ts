import type { Worker } from "bullmq";
import mongoose from "mongoose";
import { disconnectDB } from "../config/db.js";

const shutdownWorker = async (
	signal: "SIGINT" | "SIGTERM",
	worker: Worker,
	conn: mongoose.Mongoose
) => {
	try {
		console.log(`📴 Received signal:${signal}`);
		console.log(`🧹 [${worker.name}] Gracefully shutting down worker...`);
		await worker.close();
		await disconnectDB(conn);
		console.log(`✅ [${worker.name}] Shut down successful`);
		process.exit(0);
	} catch (error) {
		console.error(`❌ [${worker.name}] Error shutting down worker:`, error);
		process.exit(1);
	}
};

export default shutdownWorker;
