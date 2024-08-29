import mongoose from "mongoose";
import { addressSchema } from "./user.model.js";

export const orderItemSchema = new mongoose.Schema({
	pizza: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Pizza",
		required: true,
	},
	name: { type: String, required: true },
	description: { type: String, default: "" },
	images: [{ type: String, default: [] }],
	category: { type: String, required: true },

	selectedIngredients: [{ type: String }],

	size: { type: String, enum: ["small", "medium", "large"], required: true },
	quantity: { type: Number, default: 1 },

	totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		items: [orderItemSchema],
		orderTotalPrice: { type: Number, required: true },
		deliveryAddress: addressSchema,
		status: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"preparing",
				"outForDelivery",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},

		razorpayOrderId: { type: String, required: true },
		razorpayPaymentId: { type: String, required: true },
		razorpaySignature: { type: String, required: true },
	},
	{ timestamps: { createdAt: "orderedOn", updatedAt: "fulfilledOn" } }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
