import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI as string);
		console.log(`✅ MongoDB connected: ${conn.connection.host}`);
		return conn;
	} catch (error) {
		console.log("\x1b[31m", "MongoDB connection error: ", error);
	}
};

export const disconnectDB = async (conn: mongoose.Mongoose) => {
	try {
		await conn.disconnect();
		console.log(`❌ MongoDB disconnected`);
	} catch (error) {
		console.log("\x1b[31m", "Error disconnecting MongoDB: ", error);
	}
};
