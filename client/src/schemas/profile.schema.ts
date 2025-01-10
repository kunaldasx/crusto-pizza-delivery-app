import { z } from "zod";

// Phone schema
export const phoneSchema = z.object({
	countryCode: z
		.string()
		.min(1, "Country code is required")
		.regex(/^\+?\d+$/, "Invalid country code format (e.g. +1 or 91)"),
	number: z
		.string()
		.min(6, "Phone number is too short")
		.regex(/^\d+$/, "Phone number must contain digits only"),
});

const altPhoneSchema = z
	.object({
		countryCode: z.string(),
		number: z.string(),
	})
	.optional();

// Address schema
export const addressSchema = z.object({
	street: z.string().min(1, "Street is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zip: z
		.string()
		.min(4, "ZIP code is too short")
		.regex(/^\d+$/, "ZIP must be numeric"),
	country: z.string().min(1, "Country is required"),
	phone: phoneSchema,
	altPhone: altPhoneSchema,
});

// Main profile form schema
export const profileSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	profileImage: z
		.any()
		.optional()
		.refine(
			(file) =>
				!file ||
				(file instanceof FileList &&
					file.length === 1 &&
					file[0].type.startsWith("image/")),
			"Profile image must be a valid image file"
		),
	addresses: z.array(addressSchema).optional(),
	defaultAddressIndex: z.string().regex(/^\d+$/, "Must be a valid index"),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
export type AddressFormType = z.infer<typeof addressSchema>;
