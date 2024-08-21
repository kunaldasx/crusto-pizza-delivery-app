import { getCachedPizzaPrice } from "./priceUtils.js";
import { getCachedPizzaAvailability } from "./availabilityUtils.js";
import { sizeMultiplier } from "./sizeMultiplier.js";
import type { PizzaType } from "../models/pizza.model.js";
import { CartType } from "../types/CartType.js";

export const embedPizzaData = async (pizzas: PizzaType[]) => {
	const updatedPizzas = [];

	for (const pizza of pizzas) {
		const price = await getCachedPizzaPrice(pizza._id.toString());
		const isAvailable = await getCachedPizzaAvailability(pizza._id.toString());

		const updatedPizza = {
			...pizza,
			price,
			isAvailable,
		};

		updatedPizzas.push(updatedPizza);
	}

	return updatedPizzas;
};

export const embedCartData = async (cart: CartType) => {
	const updatedItems = [];
	let cartTotalPrice = 0;

	for (const item of cart.items) {
		const price = await getCachedPizzaPrice(item.pizza._id.toString());
		const basePrice = price * sizeMultiplier[item.size];
		const totalPrice = basePrice * item.quantity;
		const isAvailable = await getCachedPizzaAvailability(
			item.pizza._id.toString()
		);

		const updatedItem = {
			...item,
			pizza: { ...item.pizza, price, isAvailable },
			basePrice,
			totalPrice,
		};

		updatedItems.push(updatedItem);

		cartTotalPrice += price * item.quantity;
	}

	return { ...cart, items: updatedItems, cartTotalPrice };
};
