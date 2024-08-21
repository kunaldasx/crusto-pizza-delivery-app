import { AddressType } from "./AuthState";
import { SizeCategory } from "./CartState";
import { OrderResultType, StoreResultType } from "./StoreResultType";

export enum OrderStatus {
	Pending = "pending",
	Confirmed = "confirmed",
	Preparing = "preparing",
	Delivered = "delivered",
	Cancelled = "cancelled",
}

export interface OrderItemType {
	pizza: string;
	name: string;
	description: string;
	images: string[];
	category: string;

	selectedIngredients: string[];

	size: SizeCategory;
	quantity: number;

	totalPrice: number;
}

export interface OrderType {
	_id: string;
	user: string;
	items: OrderItemType[];
	orderTotalPrice: number;
	deliveryAddress: AddressType;
	status: OrderStatus;
	orderedOn: Date;
	fulfilledOn: Date;
}

export interface OrderStoreType {
	allOrders: OrderType[];
	orders: OrderType[];
	isLoading: boolean;
}

interface OrderActionsType {
	getAllOrders: () => Promise<StoreResultType>;
	getOrdersByUser: () => Promise<StoreResultType>;
	createOrder: (amount: number) => Promise<OrderResultType>;
	verifyPayment: (order: OrderPayload) => Promise<StoreResultType>;
	updateOrderStatus: (
		orderId: string,
		status: OrderStatus
	) => Promise<StoreResultType>;
}

export type OrderState = OrderStoreType & OrderActionsType;

export interface OrderPayload {
	user: string;
	items: OrderItemType[];
	orderTotalPrice: number;
	deliveryAddress: AddressType;
	razorpayOrderId: string;
	razorpayPaymentId: string;
	razorpaySignature: string;
}
