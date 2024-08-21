import type { Request, Response } from "express";
import razorpay from "../config/razorPay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { updateIngredientStock } from "../utils/updateIngredientStock.js";

const getAllOrders = async (req: Request, res: Response) => {
	try {
		const allOrders = await Order.find().lean();

		if (!allOrders) {
			res.status(404).json({ success: false, message: "No Orders found" });
			return;
		}
		res.status(200).json({
			allOrders,
			success: true,
			message: "Orders fetched",
		});
	} catch (error) {
		console.log("Error in getAllOrders controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const getOrdersByUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const orders = await Order.find({ user: userId }).lean();

		if (!orders) {
			res.status(404).json({ success: false, message: "Orders not found" });
			return;
		}
		res.status(200).json({
			orders,
			success: true,
			message: "Orders fetched",
		});
	} catch (error) {
		console.log(
			"Error in getOrdersByUser controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const createOrder = async (req: Request, res: Response) => {
	try {
		const { amount } = req.body;

		if (typeof amount !== "number" || amount <= 0) {
			res.status(400).json({ success: false, message: "Invalid amount" });
			return;
		}

		const options = {
			amount: Math.round(amount * 100), // in paise
			currency: "INR",
			receipt: `receipt_${Date.now()}`,
		};

		const order = await razorpay.orders.create(options);

		res.status(200).json({ order, success: true, message: "Order created" });
	} catch (error) {
		console.log("Error in createOrder controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const verifyPayment = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

		const body = razorpayOrderId + "|" + razorpayPaymentId;
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
			.update(body.toString())
			.digest("hex");

		const isValid = expectedSignature === razorpaySignature;

		if (isValid) {
			const newOrder = await Order.create(req.body);

			if (newOrder) {
				const cart = await Cart.findOne({ user: userId });

				if (!cart) {
					res.status(404).json({ success: false, message: "Cart not found" });
					return;
				}

				// Clear the array correctly
				cart.items.splice(0, cart.items.length);

				await cart.save();
			}

			res
				.status(200)
				.json({ order: newOrder, success: true, message: "Payment verified" });
		} else {
			res.status(400).json({ success: false, message: "Invalid signature" });
		}
	} catch (error) {
		console.log("Error in verifyPayment controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const updateOrderStatus = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	try {
		const order = await Order.findOneAndUpdate(
			{ _id: id },
			{ status },
			{ new: true }
		);

		if (!order) {
			res.status(404).json({ success: true, message: "Order not found" });
			return;
		}

		// If marked as 'delivered', decrement ingredient stock
		if (status === "delivered") {
			await updateIngredientStock(id);
		}

		res.status(200).json({ order, success: true, message: "Order updated" });
	} catch (error) {
		console.log(
			"Error in updateOrderStatus controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	getAllOrders,
	getOrdersByUser,
	createOrder,
	verifyPayment,
	updateOrderStatus,
};
