import type { Job } from "bullmq";
import Pizza from "../../models/pizza.model.js";
import {
	cachePizzaAvailability,
	checkPizzaAvailability,
} from "../../utils/availabilityUtils.js";

const availabilityProcessor = async (job: Job) => {
	const { ingredientId } = job.data;
	console.log(
		`👨‍🍳 [AvailabilityWorker] Updating availability for pizzas with ingredient: ${ingredientId}`
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
				const isAvailable = await checkPizzaAvailability(pizza);
				await cachePizzaAvailability(pizza._id.toString(), isAvailable);
				console.log(
					`✅ Cached availability for pizza: "${pizza._id}": ${isAvailable}`
				);
			} catch (error) {
				console.error(
					`❌ Failed to cache availability for pizza: ${pizza._id}`,
					error
				);
			}
		}
	} catch (error) {
		console.error(
			`❌ [AvailabilityWorker] Failed to process job for ingredient: ${ingredientId}`,
			error
		);
		throw error; // Re-throw to allow retry
	}
};

export default availabilityProcessor;
