import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
	type: { type: String, enum: ["signup", "order"], required: true },
	username: { type: String, required: true },
	timestamp: { type: Date, default: Date.now, required: true },
	metadata: mongoose.Schema.Types.Mixed,
});

export const Activity = mongoose.model("Activity", activitySchema);
