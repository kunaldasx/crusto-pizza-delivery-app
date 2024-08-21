import type { Request, Response } from "express";
import Cart from "../models/cart.model.js";
import { getCachedPizzaPrice } from "../utils/priceUtils.js";
import { getCachedPizzaAvailability } from "../utils/availabilityUtils.js";
import { sizeMultiplier } from "../utils/sizeMultiplier.js";
import { embedCartData } from "../utils/embedCachedData.js";
import { CartType } from "../types/CartType.js";
import Pizza from "../models/pizza.model.js";

const syncCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const { unsyncedCartItems } = req.body;

		let cart = await Cart.findOne({ user: userId });

		if (!cart) {
			cart = new Cart({ user: userId });
		}

		if (Array.isArray(unsyncedCartItems) && unsyncedCartItems.length > 0) {
			for (const unsyncedItem of unsyncedCartItems) {
				const alreadyExists = cart.items.find(
					(existingItem) =>
						existingItem.pizza.toString() === unsyncedItem.pizza.toString() &&
						existingItem.size === unsyncedItem.size
				);

				if (alreadyExists) {
					// Increase quantity of existing item
					cart.items.forEach((item) => {
						if (
							item.pizza.toString() === unsyncedItem.pizza.toString() &&
							item.size === unsyncedItem.size
						) {
							item.quantity += unsyncedItem.quantity;
						}
					});
				} else {
					// Add the unsynced item
					cart.items.push(unsyncedItem);
				}
			}
		}

		await cart.save();

		// SOLUTION 2: Use MongoDB aggregation to clean up deleted references
		const pizzaIds = cart.items.map((item) => item.pizza);

		if (pizzaIds.length > 0) {
			// Get existing pizza IDs
			const existingPizzaIds = await Pizza.find(
				{ _id: { $in: pizzaIds } },
				{ _id: 1 }
			).distinct("_id");

			// Get deleted pizza IDs
			const deletedPizzaIds = pizzaIds.filter(
				(pizzaId) =>
					!existingPizzaIds.some(
						(existingId) => existingId.toString() === pizzaId.toString()
					)
			);

			// Remove items with deleted pizza references using $pull
			if (deletedPizzaIds.length > 0) {
				await Cart.updateOne(
					{ user: userId },
					{
						$pull: {
							items: {
								pizza: { $in: deletedPizzaIds },
							},
						},
					}
				);
			}
		}

		const newCart = await Cart.findOne({ user: userId })
			.populate({
				path: "items.pizza",
				populate: [
					{ path: "base", select: "name price", options: { lean: true } },
					{ path: "sauce", select: "name price", options: { lean: true } },
					{ path: "cheese", select: "name price", options: { lean: true } },
					{ path: "veggie", select: "name price", options: { lean: true } },
					{ path: "extra", select: "name price", options: { lean: true } },
				],
			})
			.lean<CartType>();

		if (!newCart) {
			res.status(404).json({
				success: false,
				message: "Cart not found",
			});
			return;
		}

		const updatedCart = await embedCartData(newCart);

		res.status(200).json({
			cart: updatedCart,
			success: true,
			message: "Cart fetched",
		});
	} catch (error) {
		console.log("Error in syncCart controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const addToCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const { item } = req.body;

		let cart = await Cart.findOne({ user: userId });

		if (!cart) {
			cart = new Cart({ user: userId });
			await cart.save();
		}

		const alreadyExists = cart.items.find(
			(existingItem) =>
				existingItem.pizza._id === item.pizza && existingItem.size === item.size
		);

		if (alreadyExists) {
			res.status(404).json({
				success: false,
				message: "Item already exists in cart",
			});
			return;
		}

		cart.items.push(item);
		await cart.save();

		const addedItem = cart.items.at(-1);
		if (!addedItem) {
			res.status(404).json({
				success: false,
				message: "Item couldn't be added",
			});
			return;
		}

		// Get cached data for client
		const price = await getCachedPizzaPrice(addedItem.pizza.toString());

		// Price according to the size
		const basePrice = price * sizeMultiplier[addedItem.size];

		// Final price adding the quantity
		const totalPrice = basePrice * addedItem.quantity;
		const isAvailable = await getCachedPizzaAvailability(
			addedItem.pizza.toString()
		);

		const populatedItem = await Pizza.findById(item.pizza)
			.populate([
				{ path: "base", select: "name price", options: { lean: true } },
				{ path: "sauce", select: "name price", options: { lean: true } },
				{ path: "cheese", select: "name price", options: { lean: true } },
				{ path: "veggie", select: "name price", options: { lean: true } },
				{ path: "extra", select: "name price", options: { lean: true } },
			])
			.lean();

		if (!populatedItem) {
			res.status(404).json({
				success: false,
				message: "Pizza not found",
			});
			return;
		}

		const updatedItem = {
			...addedItem.toObject(),
			pizza: { ...populatedItem, price, isAvailable },
			basePrice,
			totalPrice,
		};

		res.status(200).json({
			cartItem: updatedItem,
			success: true,
			message: "Pizza added to cart",
		});
	} catch (error) {
		console.log("Error in addToCart controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const updateCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const itemId = req.params.id;
		const { quantity } = req.body;

		const cart = await Cart.findOne({ user: userId });

		if (!cart) {
			res.status(404).json({ success: false, message: "Cart not found" });
			return;
		}

		const item = cart.items.id(itemId);

		if (!item) {
			res.status(404).json({ success: false, message: "Item not found" });
			return;
		}

		item.quantity = quantity;
		await cart.save();

		res.status(200).json({
			success: true,
			message: "Item updated",
		});
	} catch (error) {
		console.log("Error in updateCartItem controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const removeFromCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const itemId = req.params.id;

		const cart = await Cart.findOne({ user: userId });

		if (!cart) {
			res.status(404).json({ success: false, message: "Cart not found" });
			return;
		}

		const item = cart.items.id(itemId);
		if (!item) {
			res.status(404).json({ message: "Item not found" });
			return;
		}

		// Remove the subDocument with matching _id
		cart.items.pull(itemId);
		await cart.save();

		res.status(200).json({
			success: true,
			message: "Item removed from cart",
		});
	} catch (error) {
		console.log("Error in removeFromCart controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const clearCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;

		const cart = await Cart.findOne({ user: userId });

		if (!cart) {
			res.status(404).json({ success: false, message: "Cart not found" });
			return;
		}

		// Clear the array correctly
		cart.items.splice(0, cart.items.length);

		await cart.save();

		res.status(200).json({
			success: true,
			message: "Cart cleared",
		});
	} catch (error) {
		console.log("Error in clearCart controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	syncCart,
	addToCart,
	updateCart,
	removeFromCart,
	clearCart,
};
