import { z } from "zod";

export const pizzaSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	category: z.string().min(1, "Category is required"),
	badge: z.string().optional(),

	// Ingredients
	base: z.string({ required_error: "Pizza base is required" }),
	sauce: z.string({ required_error: "Sauce is required" }),
	cheese: z.array(z.string()).optional(),
	veggie: z.array(z.string()).optional(),
	extra: z.array(z.string()).optional(),
});

export type PizzaFormType = z.infer<typeof pizzaSchema>;
