import nodemailer from "nodemailer";
import "dotenv/config";

export const mailClient = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_SENDER_EMAIL,
		pass: process.env.NODEMAILER_SENDER_PASSWORD,
	},
});
