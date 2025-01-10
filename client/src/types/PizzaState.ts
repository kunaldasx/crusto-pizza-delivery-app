import { IngredientType } from "./IngredientState";
import { StoreResultType } from "./StoreResultType";

export interface PizzaType {
	_id: string;
	name: string;
	description?: string;
	images?: string[];
	category: string;
	badge?: string;

	base: IngredientType;
	sauce: IngredientType;
	cheese?: IngredientType[];
	veggie?: IngredientType[];
	extra?: IngredientType[];

	isListed: boolean;
	createdBy: string | null;

	createdAt?: Date;
	updatedAt?: Date;

	// Local Only Fields
	price: number;
	isAvailable: boolean;
}

interface PizzaStoreType {
	pizzas: PizzaType[];
	isLoading: boolean;
}

interface PizzaActionsType {
	getAllPizzas: () => Promise<StoreResultType>;
	createPizza: (pizzaData: FormData) => Promise<StoreResultType>;
	updatePizza: (
		pizzaId: string,
		pizzaData: FormData
	) => Promise<StoreResultType>;
	deletePizza: (pizzaId: string) => Promise<StoreResultType>;
}

export type PizzaState = PizzaStoreType & PizzaActionsType;

export interface PizzaPayload {
	name: string;
	description?: string;
	category: string;
	badge?: string;

	base: string;
	sauce: string;
	cheese?: string[];
	veggie?: string[];
	extra?: string[];
}
