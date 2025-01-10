import mongoose, { InferSchemaType, Types } from "mongoose";
import bcrypt from "bcryptjs";

export const addressSchema = new mongoose.Schema({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zip: { type: String, required: true },
	country: { type: String, required: true },
	phone: {
		type: {
			countryCode: { type: String, required: true },
			number: { type: String, required: true },
		},
		required: true,
	},
	altPhone: {
		type: {
			countryCode: { type: String },
			number: { type: String },
		},
		required: false,
		default: undefined,
	},
});

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profileImage: {
			type: String,
			default: "",
		},
		addresses: { type: [addressSchema], default: undefined, required: false },
		defaultAddress: {
			type: addressSchema,
			default: undefined,
			required: false,
		},
		role: {
			type: String,
			enum: ["customer", "admin"],
			required: true,
			default: "customer",
		},

		isVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		resetPasswordToken: String,
		resetPasswordTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		console.log("Error hashing password");
		next(error as Error);
	}
});

export type UserType = InferSchemaType<typeof userSchema> & {
	_id: Types.ObjectId;
};

const User = mongoose.model("User", userSchema);

export default User;
