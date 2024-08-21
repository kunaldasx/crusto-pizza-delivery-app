import { QueueEvents, Worker } from "bullmq";
import availabilityProcessor from "../processors/availabilityProcessor.js";
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

	const availabilityWorker = new Worker(
		"pizza-availability",
		availabilityProcessor,
		{
			connection: redis,
			concurrency: 5,
		}
	);

	const events = new QueueEvents("pizza-availability", {
		connection: redis,
	});

	events.on("completed", ({ jobId }) => {
		console.log(`✅ [AvailabilityWorker] Job: ${jobId} completed`);
	});
	events.on("failed", ({ jobId, failedReason }) => {
		console.error(
			`❌ [AvailabilityWorker] Job: ${jobId} failed: ${failedReason}`
		);
	});

	availabilityWorker.on("error", (error: Error) => {
		console.error("❌ [AvailabilityWorker] Worker error:", error);
	});

	// 🧹 Graceful shutdown logic
	process.on("SIGINT", () =>
		shutdownWorker("SIGINT", availabilityWorker, conn)
	);
	process.on("SIGTERM", () =>
		shutdownWorker("SIGTERM", availabilityWorker, conn)
	);
})();
