import { handleZustandError } from "@/lib/utils";
import { OrderPayload, OrderState, OrderStatus } from "@/types/OrderState";
import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${import.meta.env.VITE_API_INITIAL_URL}/api/order`;

export const useOrderStore = create<OrderState>((set) => ({
	allOrders: [],
	orders: [],
	isLoading: false,

	getAllOrders: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_INITIAL_URL}/all`);

			set({
				allOrders: response.data.allOrders,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	getOrdersByUser: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_INITIAL_URL}/`);

			set({
				orders: response.data.orders,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	createOrder: async (amount: number) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/`, {
				amount,
			});

			return {
				order: response.data.order,
				success: response.data.success,
				message: response.data.message,
			};
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	verifyPayment: async (order: OrderPayload) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(
				`${API_INITIAL_URL}/verify-payment`,
				order
			);

			set((state) => ({
				allOrders: [...state.allOrders, response.data.order],
				orders: [...state.orders, response.data.order],
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	updateOrderStatus: async (orderId: string, status: OrderStatus) => {
		set({ isLoading: true });
		try {
			const response = await axios.put(`${API_INITIAL_URL}/${orderId}`, {
				status,
			});

			set((state) => ({
				allOrders: state.allOrders.map((order) =>
					order._id === orderId ? { ...order, ...response.data.order } : order
				),
				orders: state.orders.map((order) =>
					order._id === orderId ? { ...order, ...response.data.order } : order
				),
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
