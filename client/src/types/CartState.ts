import { PizzaType } from "./PizzaState";
import { StoreResultType } from "./StoreResultType";

export enum SizeCategory {
	Small = "small",
	Medium = "medium",
	Large = "large",
}

export interface CartItemType {
	_id: string;
	pizza: PizzaType;
	size: SizeCategory;
	quantity: number;
	basePrice: number; // with size
	totalPrice: number; // With size and quantity

	// Local Only fields
	isSynced: boolean;
}

interface CartType {
	_id: string;
	user?: string;
	items: CartItemType[];
	cartTotalPrice: number;
	createdAt: Date;
	updatedAt: Date;
}

interface CartStoreType {
	cart: CartType | null;
	isLoading: boolean;
}

interface CartActionsType {
	syncCart: (userId: string) => Promise<StoreResultType>;
	addToCart: (
		item: CartItemPayload,
		userId: string | null
	) => Promise<StoreResultType>;
	updateCart: (
		itemId: string,
		quantity: number,
		userId: string | null
	) => Promise<StoreResultType>;
	removeFromCart: (
		itemId: string,
		userId: string | null
	) => Promise<StoreResultType>;
	clearCart: (userId: string | null) => Promise<StoreResultType>;
	clearLocalStorage: () => Promise<StoreResultType>;
}

export type CartState = CartStoreType & CartActionsType;

export interface CartItemPayload {
	pizza: string | PizzaType; // _id
	size: SizeCategory;
	quantity: number;
}
