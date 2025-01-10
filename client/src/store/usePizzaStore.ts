import { handleZustandError } from "@/lib/utils";
import { PizzaState } from "@/types/PizzaState";
import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${import.meta.env.VITE_API_INITIAL_URL}/api/pizza`;

export const usePizzaStore = create<PizzaState>((set) => ({
	pizzas: [],
	isLoading: false,

	getAllPizzas: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_INITIAL_URL}/`);

			set({
				pizzas: response.data.pizzas,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
	// Store Menu(Admin only)
	createPizza: async (pizzaData: FormData) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/`, pizzaData);

			set((state) => ({
				pizzas: [...state.pizzas, response.data.pizza],
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
	// Store Menu(Admin only)
	updatePizza: async (pizzaId: string, pizzaData: FormData) => {
		set({ isLoading: true });
		try {
			const response = await axios.put(
				`${API_INITIAL_URL}/${pizzaId}`,
				pizzaData
			);

			set((state) => ({
				pizzas: state.pizzas.map((pizza) =>
					pizza._id === pizzaId ? response.data.pizza : pizza
				),
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
	// Store Menu(Admin only)
	deletePizza: async (pizzaId: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.delete(`${API_INITIAL_URL}/${pizzaId}`);

			set((state) => ({
				pizzas: state.pizzas.filter((pizza) => pizza._id !== pizzaId),
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
