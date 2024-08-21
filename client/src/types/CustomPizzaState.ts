import { IngredientType } from "./IngredientState";
import { PizzaType } from "./PizzaState";
import { StoreResultType } from "./StoreResultType";

export interface CustomPizzaType extends PizzaType {
	//Only for custom pizzas
	isSynced: boolean;
}

interface CustomPizzaStoreType {
	customPizzas: CustomPizzaType[];
	isLoading: boolean;
}

export interface IngredientsMap {
	base: IngredientType[];
	sauce: IngredientType[];
	cheese: IngredientType[];
	veggie: IngredientType[];
	extra: IngredientType[];
}

interface CustomPizzaActionsType {
	syncCustomPizzas: (userId: string) => Promise<StoreResultType>;
	createCustomPizza: (
		pizzaData: FormData,
		ingredients: IngredientsMap,
		userId: string | null
	) => Promise<StoreResultType>;
	updateCustomPizza: (
		pizzaId: string,
		pizzaData: FormData,
		ingredients: IngredientsMap,
		userId: string | null
	) => Promise<StoreResultType>;
	deleteCustomPizza: (
		pizzaId: string,
		userId: string | null
	) => Promise<StoreResultType>;
	clearLocalStorage: () => Promise<StoreResultType>;
}

export type CustomPizzaState = CustomPizzaStoreType & CustomPizzaActionsType;

export interface CustomPizzaPayload {
	name: string;
	description?: string;

	base: IngredientType;
	sauce: IngredientType;
	cheese?: IngredientType[];
	veggie?: IngredientType[];
	extra?: IngredientType[];
}

export interface ImageState {
	id: string;
	url: string;
	file?: File;
	status: "existing" | "new" | "deleted";
}
