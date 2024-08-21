import { IngredientCategory } from "@/types/IngredientState";
import { z } from "zod";

export const ingredientQuickSchema = z.object({
	price: z
		.number({ required_error: "Select a price" })
		.min(1, "Price should be at least 1"),
	stock: z
		.number({ required_error: "Select a quantity" })
		.min(0, "Stock should be at least 0"),
});

export type IngredientQuickFormType = z.infer<typeof ingredientQuickSchema>;

export const ingredientSchema = z.object({
	name: z.string().min(1, "Name is required"),
	type: z.enum(
		[
			IngredientCategory.Base,
			IngredientCategory.Sauce,
			IngredientCategory.Cheese,
			IngredientCategory.Veggie,
			IngredientCategory.Extra,
		],
		{
			required_error: "Type is required",
		}
	),
	image: z
		.any()
		.optional()
		.refine(
			(file) =>
				!file ||
				(file instanceof FileList &&
					file.length === 1 &&
					file[0].type.startsWith("image/")),
			"Image must be a valid image file"
		),

	price: z.coerce
		.number({ required_error: "Select a price" })
		.min(1, "Price should be at least 1"),

	stock: z.coerce
		.number({ required_error: "Select a quantity" })
		.min(0, "Stock should be at least 0"),
});

export type IngredientFormType = z.infer<typeof ingredientSchema>;
