import { StoreResultType } from "./StoreResultType";

export enum IngredientCategory {
	Base = "base",
	Sauce = "sauce",
	Cheese = "cheese",
	Veggie = "veggie",
	Extra = "extra",
}

export interface IngredientType {
	_id: string;
	name: string;
	type: IngredientCategory;
	image: string;
	price: number;
	stock: number;
	isAvailable: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface IngredientStoreType {
	ingredients: IngredientType[];
	base: IngredientType[];
	sauce: IngredientType[];
	cheese: IngredientType[];
	veggie: IngredientType[];
	extra: IngredientType[];
	isLoading: boolean;
}

interface IngredientActionsType {
	getAllIngredients: () => Promise<StoreResultType>;
	createIngredient: (ingredientData: FormData) => Promise<StoreResultType>;
	updateIngredient: (
		id: string,
		currType: IngredientCategory,
		ingredientData: FormData
	) => Promise<StoreResultType>;
	deleteIngredient: (
		id: string,
		type: IngredientCategory
	) => Promise<StoreResultType>;
	restoreIngredient: (
		id: string,
		type: IngredientCategory
	) => Promise<StoreResultType>;
}

export type IngredientState = IngredientStoreType & IngredientActionsType;

export interface IngredientPayload {
	name: string;
	type: IngredientCategory;
	price: number;
	stock: number;
}
