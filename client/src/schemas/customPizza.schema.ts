import { z } from "zod";

export const customPizzaSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),

	// Ingredients
	base: z.string().nonempty("Pizza base is required"),
	sauce: z.string().nonempty("Sauce is required"),
	cheese: z.array(z.string()).optional(),
	veggie: z.array(z.string()).optional(),
	extra: z.array(z.string()).optional(),
});

export type CustomPizzaFormType = z.infer<typeof customPizzaSchema>;
