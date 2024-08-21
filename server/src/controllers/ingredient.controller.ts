import type { Request, Response } from "express";
import Ingredient from "../models/ingredient.model.js";
import { priceQueue } from "../jobs/queues/priceQueue.js";
import { availabilityQueue } from "../jobs/queues/availabilityQueue.js";
import {
	deleteFromCloudinaryByUrl,
	uploadBufferToCloudinary,
} from "../utils/cloudinaryUtils.js";

const getAllIngredients = async (req: Request, res: Response) => {
	try {
		const ingredients = await Ingredient.find().lean();

		if (!ingredients) {
			res.status(404).json({
				success: false,
				message: "No ingredients found!",
			});
			return;
		}

		res.status(200).json({
			ingredients,
			success: true,
			message: "Fetched all ingredients",
		});
	} catch (error) {
		console.log(
			"Error in getAllIngredients controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const createIngredient = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to create ingredient",
			});
			return;
		}

		const ingredient = req.body;

		if (
			!ingredient.name ||
			!ingredient.type ||
			!ingredient.price ||
			!req.file
		) {
			res.status(400).json({
				success: false,
				message:
					"Ingredient is missing required fields: name, type, image or price.",
				ingredient,
			});
			return;
		}

		// Upload to cloudinary
		const uploadedImageUrl = await uploadBufferToCloudinary(
			req.file.buffer,
			"ingredients"
		);

		const newIngredient = new Ingredient({
			...ingredient,
			image: uploadedImageUrl,
		});

		await newIngredient.save();

		res.status(201).json({
			success: true,
			message: "Ingredient created",
			ingredient: newIngredient.toObject(),
		});
	} catch (error) {
		console.log(
			"Error in createIngredient controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const updateIngredient = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to update ingredient",
			});
			return;
		}

		const ingredientId = req.params.id;
		let updates = req.body;

		// Update isAvailable based on stock
		if ("stock" in req.body) {
			const newUpdates = {
				...updates,
				isAvailable: updates.stock > 0,
			};
			updates = newUpdates;
		}

		// If image is uploaded
		if (req.file) {
			// Upload to cloudinary
			const uploadedImageUrl = await uploadBufferToCloudinary(
				req.file.buffer,
				"ingredients"
			);

			// Delete old image from cloudinary
			await deleteFromCloudinaryByUrl(updates.deletedImage);

			const { deletedImage, ...rest } = updates;
			updates = {
				...rest,
				image: uploadedImageUrl,
			};
		}

		const updatedIngredient = await Ingredient.findOneAndUpdate(
			{ _id: ingredientId },
			updates,
			{
				new: true,
			}
		);

		if (!updatedIngredient) {
			res.status(404).json({
				success: false,
				message: "Ingredient not found!",
			});
			return;
		}

		// If price is updated
		if (updates.price) {
			await priceQueue.add(
				"update-pizza-price",
				{ ingredientId },
				{
					jobId: `ingredient:${ingredientId}`, // Prevents enqueuing duplicates for same ingredient
				}
			);
		}

		// If stock is updated
		if (updates.stock) {
			await availabilityQueue.add(
				"update-pizza-availability",
				{ ingredientId },
				{
					jobId: `ingredient:${ingredientId}`, // Prevents enqueuing duplicates for same ingredient
				}
			);
		}

		res.status(200).json({
			success: true,
			message: "Ingredient updated",
			ingredient: updatedIngredient.toObject(),
		});
	} catch (error) {
		console.log(
			"Error in updateIngredient controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const deleteIngredient = async (req: Request, res: Response) => {
	try {
		const ingredientId = req.params.id;

		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to delete ingredient",
			});
			return;
		}

		await Ingredient.findByIdAndUpdate(ingredientId, { isDeleted: true });

		// Make pizzas unavailable
		await availabilityQueue.add(
			"update-pizza-availability",
			{ ingredientId },
			{
				jobId: `ingredient:${ingredientId}`, // Prevents enqueuing duplicates for same ingredient
			}
		);

		res.json({ success: true, message: "Ingredient deleted" });
	} catch (error) {
		console.log(
			"Error in deleteIngredient controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const restoreIngredient = async (req: Request, res: Response) => {
	try {
		const ingredientId = req.params.id;

		if (req.user?.role !== "admin") {
			res.status(400).json({
				success: false,
				message: "Unauthorized to restore ingredient",
			});
			return;
		}

		await Ingredient.findByIdAndUpdate(ingredientId, { isDeleted: false });

		// Make pizzas unavailable
		await availabilityQueue.add(
			"update-pizza-availability",
			{ ingredientId },
			{
				jobId: `ingredient:${ingredientId}`, // Prevents enqueuing duplicates for same ingredient
			}
		);

		res.json({ success: true, message: "Ingredient restored" });
	} catch (error) {
		console.log(
			"Error in restoreIngredient controller",
			(error as Error).message
		);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	getAllIngredients,
	createIngredient,
	updateIngredient,
	deleteIngredient,
	restoreIngredient,
};
