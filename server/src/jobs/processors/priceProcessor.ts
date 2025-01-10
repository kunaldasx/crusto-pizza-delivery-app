import type { Job } from "bullmq";
import Pizza from "../../models/pizza.model.js";
import {
	cachePizzaPrice,
	calculatePizzaPrice,
} from "../../utils/priceUtils.js";

const priceProcessor = async (job: Job) => {
	const { ingredientId } = job.data;
	console.log(
		`👨‍🍳 [priceWorker] Recalculating prices for pizzas with ingredient: ${ingredientId}`
	);
	try {
		const pizzas = await Pizza.find({
			$or: [
				{ base: ingredientId },
				{ sauce: ingredientId },
				{ cheese: ingredientId },
				{ veggie: ingredientId },
				{ extra: ingredientId },
			],
		}).exec();

		console.log(
			`🍕 Found ${pizzas.length} pizzas using ingredient: ${ingredientId}`
		);

		for (const pizza of pizzas) {
			try {
				const price: number = await calculatePizzaPrice(pizza);
				await cachePizzaPrice(pizza._id.toString(), price);
				console.log(`✅ Cached price for pizza "${pizza._id}": ₹${price}`);
			} catch (error) {
				console.error(`⚠️ Failed to cache price for pizza ${pizza._id}`, error);
			}
		}
	} catch (error) {
		console.error(
			`❌ [priceWorker] Failed to process job for ingredient: ${ingredientId}`,
			error
		);
		throw error; // Re-throw to allow retry
	}
};

export default priceProcessor;
