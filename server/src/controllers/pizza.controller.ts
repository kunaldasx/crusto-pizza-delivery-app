import type { Request, Response } from "express";
import Pizza from "../models/pizza.model.js";
import {
	deleteCachedPizzaPrice,
	updateCachedPizzaPrice,
} from "../utils/priceUtils.js";
import {
	deleteCachedPizzaAvailability,
	updateCachedPizzaAvailability,
} from "../utils/availabilityUtils.js";
import { embedPizzaData } from "../utils/embedCachedData.js";
import {
	deleteMultipleFromCloudinaryByUrl,
	uploadBufferToCloudinary,
} from "../utils/cloudinaryUtils.js";

// Get all listed pizzas
const getAllPizzas = async (req: Request, res: Response) => {
	try {
		const pizzas = await Pizza.find({ isListed: true })
			.populate(["base", "sauce", "cheese", "veggie", "extra"])
			.lean();

		if (!pizzas) {
			res.status(404).json({
				success: false,
				message: "No pizzas found!",
			});
			return;
		}

		// Embed the price and isAvailable fields to each pizza
		const updatedPizzas = await embedPizzaData(pizzas);

		res.status(200).json({
			success: true,
			message: "Fetched all pizzas",
			pizzas: updatedPizzas,
		});
	} catch (error) {
		console.log("Error in getAllPizzas controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Store Menu(Admin only)
const createPizza = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to create pizza!",
			});
			return;
		}

		let pizza = req.body;
		const files = req.files as Express.Multer.File[] | undefined;

		// validate Pizza
		if (!pizza.name || !pizza.category || !pizza.base || !pizza.sauce) {
			res.status(400).json({
				success: false,
				message:
					"Pizza is missing required fields: name, category, or ingredients.",
				pizza,
			});
			return;
		}

		// Upload to cloudinary
		if (files) {
			const uploadPromises = files.map((file) =>
				uploadBufferToCloudinary(file.buffer, "pizzas")
			);

			const uploadedImageUrls = await Promise.all(uploadPromises);

			pizza = { ...pizza, images: uploadedImageUrls };
		}

		const newPizza = new Pizza(pizza);
		await newPizza.save();

		const populatedPizza = await Pizza.findById(newPizza._id)
			.populate(["base", "sauce", "cheese", "veggie", "extra"])
			.lean();

		if (!populatedPizza) {
			res.status(404).json({
				success: false,
				message: "Pizza not found.",
			});
			return;
		}

		// Update cache
		const price = await updateCachedPizzaPrice(newPizza);
		const isAvailable = await updateCachedPizzaAvailability(newPizza);

		res.status(201).json({
			success: true,
			message: "Pizza created",
			pizza: { ...populatedPizza, price, isAvailable },
		});
	} catch (error) {
		console.log("Error in createPizza controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Store Menu(Admin only)
const updatePizza = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to update this pizza",
			});
			return;
		}

		let updates = req.body;
		const pizzaId = req.params.id;
		const files = req.files as Express.Multer.File[] | undefined;

		if (updates.deletedImages?.length) {
			await deleteMultipleFromCloudinaryByUrl(updates.deletedImages);

			const { deletedImages, ...rest } = updates;
			updates = rest;
		}

		// Existing (Not deleted)
		const { existingImages, ...rest } = updates;
		updates = { ...rest, images: existingImages };

		// Upload to cloudinary
		if (files) {
			const uploadPromises = files.map((file) =>
				uploadBufferToCloudinary(file.buffer, "pizzas")
			);

			const uploadedImageUrls = await Promise.all(uploadPromises);

			// Add New and Existing images
			const images = [...(updates.images ?? []), ...uploadedImageUrls];
			updates = { ...updates, images };
		}

		const pizza = await Pizza.findOneAndUpdate(
			{ _id: pizzaId, isListed: true },
			updates,
			{
				new: true,
			}
		);

		if (!pizza) {
			res.status(404).json({
				success: false,
				message: "Pizza not updated!",
			});
			return;
		}

		const populatedPizza = await Pizza.findById(pizza._id)
			.populate(["base", "sauce", "cheese", "veggie", "extra"])
			.lean();

		if (!populatedPizza) {
			res.status(404).json({
				success: false,
				message: "Pizza not found.",
			});
			return;
		}

		// Update cache
		const price = await updateCachedPizzaPrice(pizza);
		const isAvailable = await updateCachedPizzaAvailability(pizza);

		res.status(200).json({
			success: true,
			message: "Pizza updated",
			pizza: { ...populatedPizza, price, isAvailable },
		});
	} catch (error) {
		console.log("Error in updatePizza controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

// Store Menu(Admin only)
const deletePizza = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to update this pizza",
			});
			return;
		}

		const pizzaId = req.params.id;

		const pizza = await Pizza.findOneAndDelete({
			_id: pizzaId,
			isListed: true,
		});

		if (!pizza) {
			res.status(404).json({
				success: false,
				message: "Pizza not found!",
			});
			return;
		}

		// Delete images from cloudinary
		await deleteMultipleFromCloudinaryByUrl(pizza.images);

		// Delete cache
		await deleteCachedPizzaPrice(pizzaId);
		await deleteCachedPizzaAvailability(pizzaId);

		res.status(200).json({
			success: true,
			message: "Pizza deleted",
		});
	} catch (error) {
		console.log("Error in deletePizza controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	getAllPizzas,
	createPizza,
	updatePizza,
	deletePizza,
};
