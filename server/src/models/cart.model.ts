import mongoose from "mongoose";

export const cartItemSchema = new mongoose.Schema({
	pizza: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Pizza",
		required: true,
	},

	size: {
		type: String,
		enum: ["small", "medium", "large"],
		default: "medium",
		required: true,
	},
	quantity: { type: Number, min: 1, default: 1, required: true },
});

const cartSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		items: { type: [cartItemSchema], default: [] },
	},
	{ timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
