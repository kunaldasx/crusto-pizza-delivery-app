import mongoose, { InferSchemaType } from "mongoose";

const activitySchema = new mongoose.Schema({
	type: { type: String, enum: ["signup", "order", "stock"], required: true },
	name: { type: String, required: true },
	timestamp: { type: Date, default: Date.now, required: true },
	metadata: mongoose.Schema.Types.Mixed,
});

export const Activity = mongoose.model("Activity", activitySchema);
