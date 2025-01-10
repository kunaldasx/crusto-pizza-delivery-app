import { z } from "zod";

// Add to cart Schema
export const addToCartSchema = z.object({
	size: z.enum(["small", "medium", "large"], {
		required_error: "Select a size",
	}),
	quantity: z
		.number({ required_error: "Select a quantity" })
		.min(1, "Quantity should be at least 1"),
});
export type AddToCartFormType = z.infer<typeof addToCartSchema>;

// Update cart item schema
export const updateCartSchema = z.object({
	quantity: z
		.number({ required_error: "Select a quantity" })
		.min(1, "Quantity should be at least 1"),
});

export type UpdateCartFormType = z.infer<typeof updateCartSchema>;
