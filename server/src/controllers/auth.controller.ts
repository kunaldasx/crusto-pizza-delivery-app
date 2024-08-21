import type { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../nodemailer/emails.js";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import {
	deleteFromCloudinaryByUrl,
	uploadBufferToCloudinary,
} from "../utils/cloudinaryUtils.js";

const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).lean();

		if (!user) {
			res.status(400).json({ success: false, message: "Invalid credentials" });
			return;
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			res.status(400).json({ success: false, message: "Invalid credentials" });
			return;
		}

		// Credentials Matched
		generateToken(user._id.toString(), res);

		res.status(200).json({
			success: true,
			message: "Logged In",
			user: {
				...user,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const signup = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			res
				.status(400)
				.json({ success: false, message: "All the fields are required" });
			return;
		}

		if (password.length < 6) {
			res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters",
			});
			return;
		}

		const user = await User.findOne({ email }).lean();

		if (user) {
			res.status(400).json({ success: false, message: "Email already exists" });
			return;
		}

		// Verification Token
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString();

		const hashedVerificationToken = crypto
			.createHash("sha256")
			.update(verificationToken)
			.digest("hex");

		const newUser = new User({
			username,
			email,
			password,
			verificationToken: hashedVerificationToken,
			verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});
		await newUser.save();

		// Create jwt Cookie
		generateToken(newUser._id.toString(), res);

		await sendVerificationEmail(newUser.email, verificationToken);

		// Return the user details
		res.status(201).json({
			success: true,
			message: "User created",
			user: {
				...newUser.toObject(),
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in signup controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const logout = (req: Request, res: Response) => {
	try {
		res.clearCookie("jwt");
		res.status(200).json({ success: true, message: "Logged out" });
	} catch (error) {
		console.log("Error in signout controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const verifyEmail = async (req: Request, res: Response) => {
	try {
		const { code } = req.body;
		const hashedVerificationToken = crypto
			.createHash("sha256")
			.update(code)
			.digest("hex");

		const userId = req.user?._id;

		const user = await User.findOne({ _id: userId });

		if (!user) {
			res.status(404).json({ success: false, message: "User not found" });
			return;
		}

		if (user.verificationToken !== hashedVerificationToken) {
			res.status(401).json({
				success: false,
				message: "Token is invalid or has expired",
			});
			return;
		}

		if (
			user.verificationTokenExpiresAt &&
			Date.now() > user.verificationTokenExpiresAt.getTime()
		) {
			res.status(401).json({
				success: false,
				message: "Token is invalid or has expired",
			});
			return;
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.username);

		res.status(200).json({
			success: true,
			message: "Email verified",
			user: {
				...user.toObject(),
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Email verification failed", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			res.status(404).json({ success: false, message: "User not found" });
			return;
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");

		const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		user.resetPasswordToken = hashedToken;
		user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
		await user.save();

		await sendPasswordResetEmail(
			user.email,
			`${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`
		);

		res.status(200).json({
			success: true,
			message: "Password reset link sent to email",
		});
	} catch (error) {
		console.log(
			"Error in forgot password controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;
		const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			res.status(401).json({
				success: false,
				message: "Token is invalid or has expired",
			});
			return;
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({
			success: true,
			message: "Password reset successful",
		});
	} catch (error) {
		console.log("Error in reset password controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const checkAuth = (req: Request, res: Response) => {
	try {
		res.status(200).json({
			success: true,
			message: `Welcome ${req.user?.username}`,
			user: req.user,
		});
	} catch (error) {
		console.log("Error in checkAuth controller", (error as Error).message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const updateProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		let updates = req.body;

		// Always parse addresses if key exists (even if it's an empty array)
		if ("addresses" in req.body) {
			updates.addresses = JSON.parse(req.body.addresses);
		}

		// Always parse defaultAddress, even if it's null
		if ("defaultAddress" in req.body) {
			updates.defaultAddress = JSON.parse(req.body.defaultAddress);
		}

		// Delete image from cloudinary
		if ("deletedProfileImage" in req.body) {
			await deleteFromCloudinaryByUrl(updates.deletedProfileImage);
			const { deletedProfileImage, ...rest } = updates;
			updates = { ...rest, profileImage: "" };
		}

		if (req.file) {
			// Upload to cloudinary
			const uploadedImageUrl = await uploadBufferToCloudinary(
				req.file.buffer,
				"users"
			);

			const newUpdates = { ...updates, profileImage: uploadedImageUrl };
			updates = newUpdates;
		}

		const user = await User.findOneAndUpdate({ _id: userId }, updates, {
			new: true,
		});

		if (!user) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: "User profile updated",
			user: user.toObject(),
		});
	} catch (error) {
		console.log("Error in updateProfile controller:", (error as Error).message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export default {
	login,
	signup,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	updateProfile,
};
