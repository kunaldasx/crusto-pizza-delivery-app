import redis from "../config/redis.js";
import Ingredient from "../models/ingredient.model.js";
import Pizza, { PizzaType } from "../models/pizza.model.js";

export const calculatePizzaPrice = async (
	pizza: PizzaType
): Promise<number> => {
	const ids = [
		pizza.base,
		pizza.sauce,
		...pizza.cheese,
		...pizza.veggie,
		...pizza.extra,
	];
	const ingredients = await Ingredient.find({ _id: { $in: ids } });
	const sum = ingredients.reduce(
		(sum, ingredient) => sum + ingredient.price,
		0
	);
	return parseFloat(sum.toFixed(2));
};

export const cachePizzaPrice = async (pizzaId: string, price: number) => {
	await redis.set(`price:${pizzaId}`, price.toString());
};

export const updateCachedPizzaPrice = async (pizza: PizzaType) => {
	try {
		const price = await calculatePizzaPrice(pizza);
		await deleteCachedPizzaPrice(pizza._id.toString());
		await cachePizzaPrice(pizza._id.toString(), price);
		console.log(`✅ Cached price for pizza: "${pizza._id}": ₹${price}`);
		return price;
	} catch (error) {
		console.error(`⚠️ Failed to cache price for pizza: ${pizza._id}`, error);
	}
};

export const deleteCachedPizzaPrice = async (pizzaId: string) => {
	try {
		await redis.del(`price:${pizzaId}`);
	} catch (error) {
		console.error(`⚠️ Failed to delete price for pizza: ${pizzaId}`, error);
	}
};

export const getCachedPizzaPrice = async (pizzaId: string): Promise<number> => {
	const price = await redis.get(`price:${pizzaId}`);

	if (!price) {
		console.log(`🚫 Cache miss: pizzaPrice:${pizzaId}`);
		const pizza = await Pizza.findById(pizzaId);
		if (!pizza) {
			console.log(`Pizza not found for Id: ${pizzaId}`);
			return 0;
		}
		return (await updateCachedPizzaPrice(pizza)) ?? 0;
	}

	return parseFloat(price);
};
