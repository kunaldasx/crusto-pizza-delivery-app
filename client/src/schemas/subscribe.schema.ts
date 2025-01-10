import { z } from "zod";

// Subscribe Schema
export const subscribeSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
});
export type subscribeFormType = z.infer<typeof subscribeSchema>;
