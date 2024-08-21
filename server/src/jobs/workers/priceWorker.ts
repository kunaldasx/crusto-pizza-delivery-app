import { QueueEvents, Worker } from "bullmq";
import priceProcessor from "../processors/priceProcessor.js";
import shutdownWorker from "../../utils/shutdownWorker.js";
import redis from "../../config/redis.js";
import { connectDB } from "../../config/db.js";
import "dotenv/config";

(async () => {
	const conn = await connectDB();
	if (!conn) {
		console.log("Failed to connect to MongoDB");
		return;
	}

	// Worker to process price updates
	const priceWorker = new Worker("pizza-price", priceProcessor, {
		connection: redis,
		concurrency: 5,
	});

	const events = new QueueEvents("pizza-price", {
		connection: redis,
	});

	events.on("completed", ({ jobId }) => {
		console.log(`✅ [priceWorker] Job: ${jobId} completed`);
	});
	events.on("failed", ({ jobId, failedReason }) => {
		console.error(`❌ [priceWorker] Job: ${jobId} failed: ${failedReason}`);
	});

	priceWorker.on("error", (error) => {
		console.error("❌ [priceWorker] Worker error:", error);
	});

	// 🧹 Graceful shutdown logic
	process.on("SIGINT", () => shutdownWorker("SIGINT", priceWorker, conn));
	process.on("SIGTERM", () => shutdownWorker("SIGTERM", priceWorker, conn));
})();
