import { generateTimestamp } from "../utils/generateTimestamp.js";
import {
	INGREDIENT_OUT_OF_STOCK_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailClient } from "./nodemailer.config.js";
import "dotenv/config";

export const sendVerificationEmail = async (
	email: string,
	verificationToken: string
) => {
	try {
		const response = await mailClient.sendMail({
			from: {
				name: "Crusto",
				address: process.env.NODEMAILER_SENDER_EMAIL!,
			},
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationToken
			),
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email: string, name: string) => {
	try {
		const response = await mailClient.sendMail({
			from: {
				name: "Crusto",
				address: process.env.NODEMAILER_SENDER_EMAIL!,
			},
			to: email,
			subject: "Welcome",
			html: WELCOME_EMAIL_TEMPLATE.replace(/\{companyName\}/g, "Crusto")
				.replace("{customerName}", name)
				.replace("{productPageURL}", `${process.env.CLIENT_URL}/#menu`),
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (
	email: string,
	resetURL: string
) => {
	try {
		const response = await mailClient.sendMail({
			from: {
				name: "Crusto",
				address: process.env.NODEMAILER_SENDER_EMAIL!,
			},
			to: email,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL
			),
		});

		console.log("Password reset email sent", response);
	} catch (error) {
		console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email: string) => {
	try {
		const response = await mailClient.sendMail({
			from: {
				name: "Crusto",
				address: process.env.NODEMAILER_SENDER_EMAIL!,
			},
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

export const sendStockAlertEmail = async (
	ingredientName: string,
	ingredientStock: number,
	pizzaCount: number
) => {
	try {
		const timestamp = generateTimestamp();
		const response = await mailClient.sendMail({
			from: {
				name: "Crusto",
				address: process.env.NODEMAILER_SENDER_EMAIL!,
			},
			to: process.env.ADMIN_EMAIL,
			subject: `[WARNING] Low Stock Alert - [${ingredientName}]`,
			html: INGREDIENT_OUT_OF_STOCK_TEMPLATE.replace(
				"{companyName}",
				"Crusto"
			)
				.replace("{ingredientName}", ingredientName)
				.replace("{pizza_count}", pizzaCount.toString())
				.replace("{stock}", ingredientStock.toString())
				.replace("{date}", timestamp.date)
				.replace("{time}", timestamp.time),
		});
		console.log(`Low stock alert email sent [${ingredientName}]`, response);
	} catch (error) {
		console.error(`Error sending low stock alert email`, error);
		throw new Error(`Error sending low stock alert email: ${error}`);
	}
};
