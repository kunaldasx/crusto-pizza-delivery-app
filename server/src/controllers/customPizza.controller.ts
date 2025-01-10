import { Request, Response } from "express";
import Pizza, { PizzaType } from "../models/pizza.model.js";
import {
	calculatePizzaPrice,
	deleteCachedPizzaPrice,
	updateCachedPizzaPrice,
} from "../utils/priceUtils.js";
import {
	checkPizzaAvailability,
	deleteCachedPizzaAvailability,
	updateCachedPizzaAvailability,
} from "../utils/availabilityUtils.js";
import {
	deleteMultipleFromCloudinaryByUrl,
	uploadBufferToCloudinary,
} from "../utils/cloudinaryUtils.js";
import { embedPizzaData } from "../utils/embedCachedData.js";

const syncCustomPizzas = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const { unsyncedPizzas } = req.body;

		if (Array.isArray(unsyncedPizzas) && unsyncedPizzas.length > 0) {
			// Validate each pizza
			const invalidPizzas = unsyncedPizzas.filter(
				(pizza: PizzaType) =>
					!pizza.name ||
					!pizza.category ||
					!pizza.base ||
					!pizza.sauce ||
					pizza.createdBy.toString() !== userId?.toString()
			);

			if (invalidPizzas.length > 0) {
				res.status(400).json({
					message:
						"Some pizzas are missing required fields: name, category, ingredients or createdBy, or have invalid fields",
					invalidPizzas,
				});
				return;
			}

			await Pizza.insertMany(unsyncedPizzas, { ordered: false });
		}

		// Fetch all custom pizzas freshly
		const allCustomPizzas = await Pizza.find({ createdBy: userId })
			.populate(["base", "sauce", "cheese", "veggie", "extra"])
			.lean();

		if (!allCustomPizzas) {
			res.status(404).json({
				success: false,
				message: "No pizzas found for user",
			});
			return;
		}

		// Embed the price and isAvailable field to each pizza
		const updatedPizzas = await embedPizzaData(allCustomPizzas);

		res.status(200).json({
			success: true,
			message: "Pizzas synced",
			pizzas: updatedPizzas,
		});
	} catch (error) {
		console.log("Error in syncUserPizzas controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const createCustomPizza = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		let pizza = req.body;
		const files = req.files as Express.Multer.File[] | undefined;

		// validate Pizza
		if (
			!pizza.name ||
			!pizza.category ||
			!pizza.base ||
			!pizza.sauce ||
			pizza.createdBy !== userId?.toString()
		) {
			res.status(400).json({
				message:
					"Pizza has some missing or invalid fields: name, category, ingredients, or createdBy.",
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

const updateCustomPizza = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const pizzaId = req.params.id;
		let updates = req.body;
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

		const updatedPizza = await Pizza.findOneAndUpdate(
			{ _id: pizzaId, createdBy: userId },
			updates
		);

		if (!updatedPizza) {
			res.status(401).json({
				success: false,
				message: "pizza not updated.",
			});
			return;
		}

		const populatedPizza = await Pizza.findById(pizzaId)
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
		const price = await updateCachedPizzaPrice(updatedPizza);
		const isAvailable = await updateCachedPizzaAvailability(updatedPizza);

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

const deleteCustomPizza = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const pizzaId = req.params.id;

		const pizza = await Pizza.findOneAndDelete({
			_id: pizzaId,
			createdBy: userId,
		});

		if (!pizza) {
			res.status(404).json({
				success: false,
				message: "Pizza not found!",
			});
			return;
		}

		// Delete images from cloudinary
		if (pizza.images?.length) {
			await deleteMultipleFromCloudinaryByUrl(pizza.images);
		}

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

const getPizzaPriceAvailability = async (req: Request, res: Response) => {
	try {
		const pizza = req.body;

		const price = await calculatePizzaPrice(pizza);
		const isAvailable = await checkPizzaAvailability(pizza);

		res.status(200).json({
			success: true,
			message: "Price and Availability details sent",
			price,
			isAvailable,
		});
	} catch (error) {
		console.log(
			"Error in getPizzaPriceAvailability controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	syncCustomPizzas,
	createCustomPizza,
	updateCustomPizza,
	deleteCustomPizza,
	getPizzaPriceAvailability,
};
