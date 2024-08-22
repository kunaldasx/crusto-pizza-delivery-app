import type { Request, Response, NextFunction } from "express";
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "./config/db.js";
import redis from "./config/redis.js";
import authRoutes from "./routes/auth.route.js";
import ingredientRoutes from "./routes/ingredient.route.js";
import pizzaRoutes from "./routes/pizza.route.js";
import customPizzaRoutes from "./routes/customPizza.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

(async () => {
	try {
		const conn = await connectDB();
		if (!conn) {
			console.log("Failed to connect to MongoDB");
			return;
		}

		const app = express();
		const PORT = process.env.PORT || 3000;

		app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
		app.use(express.json());
		app.use(cookieParser());
		app.set("trust proxy", 1);

		// Health check route - MUST come before catch-all
		app.get("/health", (req: Request, res: Response) => {
			res.json({ message: "Health OK!" });
		});

		// API routes - specific routes before catch-all
		app.use("/api/auth", authRoutes);
		app.use("/api/ingredient", ingredientRoutes);
		app.use("/api/pizza", pizzaRoutes);
		app.use("/api/custom-pizza", customPizzaRoutes);
		app.use("/api/cart", cartRoutes);
		app.use("/api/order", orderRoutes);
		app.use("/api/dashboard", dashboardRoutes);

		const server = app.listen(PORT, () => {
			console.log("\x1b[36m%s\x1b[0m", `Server is running on port: ${PORT}`);
		});

		const shutdown = async (signal: "SIGINT" | "SIGTERM") => {
			try {
				console.log(`📴 Received signal:${signal}`);
				console.log("🧹 [server] Gracefully shutting down...");
				server.close();
				redis.quit();
				disconnectDB(conn);
				console.log("✅ [server] Shut down successful");
				process.exit(0);
			} catch (error) {
				console.error("❌ [server] Error shutting down server:", error);
				process.exit(1);
			}
		};

		process.on("SIGINT", async () => shutdown("SIGINT"));
		process.on("SIGTERM", async () => shutdown("SIGTERM"));
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1); // exit with failure
	}
})();
