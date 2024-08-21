import { convertFormDataToObject } from "@/lib/customPizzaUtils";
import { handleZustandError } from "@/lib/utils";
import {
	CustomPizzaState,
	CustomPizzaType,
	IngredientsMap,
} from "@/types/CustomPizzaState";

import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ObjectId } from "bson";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${
	import.meta.env.VITE_API_INITIAL_URL
}/api/custom-pizza`;

export const useCustomPizzaStore = create<CustomPizzaState>()(
	persist(
		(set, get) => ({
			customPizzas: [],
			isLoading: false,

			syncCustomPizzas: async (userId: string) => {
				set({ isLoading: true });
				try {
					if (!userId) return { success: false, message: "Not authorized" };
					const { customPizzas } = get();

					// Filter unsynced pizzas
					const unsyncedPizzas = customPizzas.filter(
						(pizza: CustomPizzaType) => !pizza.isSynced
					);

					let processedPizzas;

					if (unsyncedPizzas.length) {
						// Remove Local Only fields
						processedPizzas = unsyncedPizzas.map(
							({
								price,
								isAvailable,
								isSynced,
								base,
								sauce,
								cheese,
								veggie,
								extra,
								...rest
							}) => ({
								...rest,
								base: base._id,
								sauce: sauce._id,
								cheese: cheese?.map((item) => item._id),
								veggie: veggie?.map((item) => item._id),
								extra: extra?.map((item) => item._id),
								createdBy: userId,
							})
						);
					}

					const response = await axios.post(`${API_INITIAL_URL}/sync`, {
						unsyncedPizzas: processedPizzas,
					});

					set({
						customPizzas: response.data.pizzas.map(
							(pizza: CustomPizzaType) => ({
								...pizza,
								isSynced: true,
							})
						),
					});

					return {
						success: response.data.success,
						message: response.data.message,
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			createCustomPizza: async (
				pizzaData: FormData,
				ingredients: IngredientsMap,
				userId: string | null
			) => {
				set({ isLoading: true });
				try {
					// Authenticated User
					let newPizza: CustomPizzaType;
					let response;

					if (userId) {
						pizzaData.append("category", "custom");
						pizzaData.append("isListed", "false");
						pizzaData.append("createdBy", userId);

						response = await axios.post(`${API_INITIAL_URL}/`, pizzaData);

						newPizza = {
							...response.data.pizza,
							isSynced: true,
						};
					} else {
						// GUEST USER - Store locally
						const res = await axios.post(
							`${API_INITIAL_URL}/pizza-details`,
							pizzaData
						);

						const newMongoId = new ObjectId().toString();

						newPizza = {
							_id: newMongoId,
							...convertFormDataToObject(pizzaData, ingredients),
							category: "custom",
							price: res.data.price,
							isAvailable: res.data.isAvailable,
							createdBy: userId,
							isListed: false,
							isSynced: false,
							images: [], // Empty for guest users
						};
					}

					set((state) => ({
						customPizzas: [...state.customPizzas, newPizza],
					}));

					return {
						success: response?.data.success ?? true,
						message: response?.data.message ?? "Pizza created.",
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			updateCustomPizza: async (
				pizzaId: string,
				pizzaData: FormData,
				ingredients: IngredientsMap,
				userId: string | null
			) => {
				set({ isLoading: true });
				try {
					// Authenticated User
					if (userId) {
						const response = await axios.put(
							`${API_INITIAL_URL}/${pizzaId}`,
							pizzaData
						);

						set((state) => ({
							customPizzas: state.customPizzas.map((pizza) =>
								pizza._id === pizzaId
									? { ...pizza, ...response.data.pizza }
									: pizza
							),
						}));

						return {
							success: response.data.success,
							message: response.data.message,
						};
					}

					// GUEST USER
					// Persist in Local Storage
					set((state) => ({
						customPizzas: state.customPizzas.map((pizza) =>
							pizza._id === pizzaId
								? {
										...pizza,
										...convertFormDataToObject(pizzaData, ingredients, true),
										images: [], // Empty for guest users
										updatedAt: new Date(),
								  }
								: pizza
						),
					}));

					return { success: true, message: "Pizza updated" };
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			deleteCustomPizza: async (pizzaId: string, userId: string | null) => {
				set({ isLoading: true });
				try {
					// Authenticated User
					if (userId) {
						const response = await axios.delete(
							`${API_INITIAL_URL}/${pizzaId}`
						);

						set((state) => ({
							customPizzas: state.customPizzas.filter(
								(pizza) => pizza._id !== pizzaId
							),
						}));

						return {
							success: response.data.success,
							message: response.data.message,
						};
					}

					// GUEST USER
					// Persist in Local Storage
					set((state) => ({
						customPizzas: state.customPizzas.filter(
							(pizza) => pizza._id !== pizzaId
						),
					}));

					return {
						success: true,
						message: "Pizza deleted successfully",
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			clearLocalStorage: async () => {
				set({ isLoading: true });
				try {
					set({
						customPizzas: [],
					});

					return { success: true, message: "Local storage cleared" };
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},
		}),
		{
			name: "custom-pizzas",
			partialize: (state) => ({
				customPizzas: state.customPizzas,
			}),
		}
	)
);
