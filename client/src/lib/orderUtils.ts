import { CartItemType } from "@/types/CartState";
import { OrderStatus } from "@/types/OrderState";

export const loadRazorpayScript = () =>
	new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});

export const createOrderItems = (items: CartItemType[]) => {
	const orderItems = items.map((item) => {
		const cheese = item.pizza.cheese?.map((c) => c.name);
		const veggie = item.pizza.veggie?.map((v) => v.name);
		const extra = item.pizza.extra?.map((e) => e.name);

		const selectedIngredients = [
			item.pizza.base.name,
			item.pizza.sauce.name,
			...(cheese ?? []),
			...(veggie ?? []),
			...(extra ?? []),
		];

		const updatedItem = {
			pizza: item.pizza._id,
			name: item.pizza.name,
			description: item.pizza.description ?? "",
			images: item.pizza.images ?? [],
			category: item.pizza.category,
			selectedIngredients,

			size: item.size,
			quantity: item.quantity,

			totalPrice: item.totalPrice,
		};

		return updatedItem;
	});

	return orderItems ?? [];
};

// Function to get progress value based on status
export const getOrderProgress = (status: OrderStatus) => {
	const statusProgress = {
		pending: 20,
		confirmed: 40,
		preparing: 60,
		delivered: 100,
		cancelled: 0,
	};
	return statusProgress[status?.toLowerCase() as OrderStatus] || 0;
};

// Function to get progress color based on status
export const getProgressColor = (status: string) => {
	const statusColors = {
		pending: "bg-yellow-500",
		confirmed: "bg-blue-500",
		preparing: "bg-orange-500",
		delivered: "bg-green-500",
		cancelled: "bg-red-500",
	};
	return statusColors[status?.toLowerCase() as OrderStatus] || "bg-gray-500";
};
