import mongoose, { InferSchemaType, Types } from "mongoose";
import Cart from "./cart.model.js";

const pizzaSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: "" },
		images: [{ type: String, default: [] }],
		category: { type: String, required: true },
		badge: { type: String, default: "" },

		// Ingredients
		base: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ingredient",
			required: true,
		},
		sauce: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ingredient",
			required: true,
		},
		cheese: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
		veggie: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
		extra: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],

		// For populating the MENU
		isListed: { type: Boolean, default: true },

		// For populating the CUSTOM PIZZA SECTION
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true }
);

pizzaSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		// Clean up carts but don't await (non-blocking)
		Cart.updateMany(
			{ "items.pizza": doc._id },
			{ $pull: { items: { pizza: doc._id } } }
		).catch((error) => console.error("Cart cleanup error:", error));
	}
});

export type PizzaType = InferSchemaType<typeof pizzaSchema> & {
	_id: Types.ObjectId;
};

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
