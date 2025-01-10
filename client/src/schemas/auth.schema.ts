import { z } from "zod";

// Signup Schema
export const signupSchema = z
	.object({
		username: z
			.string({ required_error: "Username is required" })
			.min(2, "Username is too short"),
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email"),
		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignupFormType = z.infer<typeof signupSchema>;

// Login Schema
export const loginSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
	password: z
		.string({ required_error: "Password is required" })
		.min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
	.object({
		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
