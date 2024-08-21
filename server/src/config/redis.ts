import IORedis from "ioredis";
import "dotenv/config";

const redisOptions = {
	username: process.env.REDIS_USERNAME || undefined,
	host: process.env.REDIS_HOST || "127.0.0.1",
	port: Number(process.env.REDIS_PORT) || 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	maxRetriesPerRequest: null,
	enableReadyCheck: true,
	reconnectOnError: (error: Error) => {
		const targetErrors = ["READONLY", "ETIMEDOUT", "ECONNRESET"];
		return targetErrors.some((e) => error.message.includes(e));
	},
	reconnectStrategy: (retries: number) => {
		const delay = Math.min(retries * 50, 2000);
		console.log(
			`🔄 Redis reconnect attempt #${retries}, retrying in ${delay}ms`
		);
		return delay;
	},
};

const redis = new IORedis(redisOptions);

// Event listeners for the client
redis.on("connect", () => console.log("✅ Redis client connected"));
redis.on("ready", () => console.log("🚀 Redis client ready to use"));
redis.on("error", (err) => console.error("❌ Redis client error:", err));
redis.on("end", () => console.log("⚠️ Redis client connection closed"));
redis.on("reconnecting", () => console.log("🔁 Redis client reconnecting..."));

export default redis;
