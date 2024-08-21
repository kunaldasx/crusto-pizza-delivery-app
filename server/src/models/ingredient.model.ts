import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		type: {
			type: String,
			enum: ["base", "sauce", "cheese", "veggie", "extra"],
			required: true,
		},
		image: { type: String, default: "" },
		price: { type: Number, required: true },
		stock: { type: Number, default: 0 },
		isAvailable: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// Automatically set isAvailable based on stock
ingredientSchema.pre("save", function (next) {
	if (this.stock < 0) {
		this.stock = 0;
	}

	this.isAvailable = this.stock > 0;
	next();
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
