import redis from "../config/redis.js";
import Ingredient from "../models/ingredient.model.js";
import Pizza, { PizzaType } from "../models/pizza.model.js";

export const checkPizzaAvailability = async (
	pizza: PizzaType
): Promise<boolean> => {
	const ids = [
		pizza.base,
		pizza.sauce,
		...pizza.cheese,
		...pizza.veggie,
		...pizza.extra,
	];
	const ingredients = await Ingredient.find({ _id: { $in: ids } });
	const hasUnavailableIngredient = ingredients.some(
		(ingredient) => !ingredient.isAvailable || ingredient.isDeleted
	);
	return !hasUnavailableIngredient; // return False if hasUnavailableIngredient === true
};

export const cachePizzaAvailability = async (
	pizzaId: string,
	isAvailable: boolean
) => {
	await redis.set(`isAvailable:${pizzaId}`, isAvailable ? "1" : "0");
};

export const updateCachedPizzaAvailability = async (pizza: PizzaType) => {
	try {
		const isAvailable = await checkPizzaAvailability(pizza);
		await deleteCachedPizzaAvailability(pizza._id.toString());
		await cachePizzaAvailability(pizza._id.toString(), isAvailable);
		console.log(
			`✅ Cached availability for pizza: "${pizza._id}": ${isAvailable}`
		);
		return isAvailable;
	} catch (error) {
		console.error(
			`⚠️ Failed to cache availability for pizza: ${pizza._id}`,
			error
		);
	}
};

export const deleteCachedPizzaAvailability = async (pizzaId: string) => {
	try {
		await redis.del(`isAvailable:${pizzaId}`);
	} catch (error) {
		console.error(
			`⚠️ Failed to delete availability for pizza: ${pizzaId}`,
			error
		);
	}
};

export const getCachedPizzaAvailability = async (
	pizzaId: string
): Promise<boolean> => {
	const isAvailable = await redis.get(`isAvailable:${pizzaId}`);

	if (isAvailable === null) {
		console.log(`🚫 Cache miss: pizzaAvailability:${pizzaId}`);
		const pizza = await Pizza.findById(pizzaId);
		if (!pizza) {
			console.log(`Pizza not found for Id: ${pizzaId}`);
			return false;
		}
		return (await updateCachedPizzaAvailability(pizza)) ?? false;
	}

	return isAvailable === "1"; // convert string to boolean
};
