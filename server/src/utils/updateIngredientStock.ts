import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Ingredient from "../models/ingredient.model.js";
import { availabilityQueue } from "../jobs/queues/availabilityQueue.js";

export async function updateIngredientStock(orderId: string) {
	const session = await mongoose.startSession();

	try {
		const result = await session.withTransaction(async () => {
			// Combined aggregation that gets usage AND current stock in one call
			const ingredientData = await Order.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(orderId),
						status: "delivered",
					},
				},
				{ $unwind: "$items" },
				{
					$lookup: {
						from: "pizzas",
						localField: "items.pizza",
						foreignField: "_id",
						as: "pizza",
					},
				},
				{ $unwind: "$pizza" },
				{
					$project: {
						quantity: "$items.quantity",
						ingredients: {
							$concatArrays: [
								[{ ingredient: "$pizza.base", type: "base" }],
								[{ ingredient: "$pizza.sauce", type: "sauce" }],
								{
									$map: {
										input: { $ifNull: ["$pizza.cheese", []] },
										in: { ingredient: "$$this", type: "cheese" },
									},
								},
								{
									$map: {
										input: { $ifNull: ["$pizza.veggie", []] },
										in: { ingredient: "$$this", type: "veggie" },
									},
								},
								{
									$map: {
										input: { $ifNull: ["$pizza.extra", []] },
										in: { ingredient: "$$this", type: "extra" },
									},
								},
							],
						},
					},
				},
				{ $unwind: "$ingredients" },
				{
					$match: {
						"ingredients.ingredient": { $ne: null },
					},
				},
				{
					$group: {
						_id: "$ingredients.ingredient",
						totalUsage: { $sum: "$quantity" },
					},
				},
				// Lookup current ingredient data
				{
					$lookup: {
						from: "ingredients",
						localField: "_id",
						foreignField: "_id",
						as: "ingredientData",
					},
				},
				{ $unwind: "$ingredientData" },
				{
					$project: {
						_id: 1,
						totalUsage: 1,
						currentStock: "$ingredientData.stock",
						newStock: {
							$max: [
								0,
								{ $subtract: ["$ingredientData.stock", "$totalUsage"] },
							],
						},
						isAvailable: {
							$gt: [
								{
									$max: [
										0,
										{ $subtract: ["$ingredientData.stock", "$totalUsage"] },
									],
								},
								0,
							],
						},
					},
				},
			]).session(session);

			if (ingredientData.length === 0) {
				throw new Error(
					"Order not found, not delivered, or no ingredients found"
				);
			}

			// Build bulk operations
			const bulkOps = ingredientData.map((data) => ({
				updateOne: {
					filter: { _id: data._id },
					update: {
						$set: {
							stock: data.newStock,
							isAvailable: data.isAvailable,
						},
					},
				},
			}));

			// Single bulk update
			const bulkResult = await Ingredient.bulkWrite(bulkOps, { session });

			// Queue jobs for zero-stock ingredients
			const zeroStockIngredients = ingredientData.filter(
				(data) => data.newStock === 0
			);

			if (zeroStockIngredients.length > 0) {
				await Promise.all(
					zeroStockIngredients.map(async (data) =>
						availabilityQueue.add(
							"update-pizza-availability",
							{ ingredientId: data._id },
							{
								jobId: `ingredient:${data._id}`,
								removeOnComplete: 10,
								removeOnFail: 5,
							}
						)
					)
				);
			}

			return {
				ingredientsProcessed: ingredientData.length,
				ingredientsUpdated: bulkResult.modifiedCount,
				zeroStockCount: zeroStockIngredients.length,
			};
		});

		console.log("Stock update completed:", result);
		return result;
	} catch (error) {
		console.error("Error updating ingredients' stock:", error);
		throw error;
	} finally {
		await session.endSession();
	}
}
