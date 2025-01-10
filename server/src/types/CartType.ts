import { Types } from "mongoose";
import { PizzaType } from "../models/pizza.model.js";

type CartItemType = {
	_id: Types.ObjectId;
	pizza: PizzaType;
	size: "small" | "medium" | "large";
	quantity: number;
};

// Final populated cart type
export type CartType = {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	items: CartItemType[];
	createdAt: Date;
	updatedAt: Date;
};
