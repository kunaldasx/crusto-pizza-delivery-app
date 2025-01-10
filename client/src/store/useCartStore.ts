import { handleZustandError, sizeMultiplier } from "@/lib/utils";
import { CartItemPayload, CartItemType, CartState } from "@/types/CartState";
import axios from "axios";
import { ObjectId } from "bson";
import { create } from "zustand";
import { persist } from "zustand/middleware";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${import.meta.env.VITE_API_INITIAL_URL}/api/cart`;

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cart: null,
			isLoading: false,

			syncCart: async (userId: string) => {
				set({ isLoading: true });
				try {
					if (!userId) return { success: false, message: "Not authorized" };
					const { cart } = get();

					// Filter unsynced Items
					const unsyncedCartItems = cart?.items.filter(
						(item) => !item.isSynced
					);

					let processedCartItems;

					// If found unsynced items
					if (unsyncedCartItems?.length) {
						// Remove Local Only fields
						processedCartItems = unsyncedCartItems?.map(
							({ pizza, size, quantity }) => ({
								pizza: pizza._id,
								size,
								quantity,
							})
						);
					}

					const response = await axios.post(`${API_INITIAL_URL}/sync`, {
						unsyncedCartItems: processedCartItems,
					});

					const updateCartItems = response.data.cart.items.map(
						(item: CartItemType) => ({
							...item,
							isSynced: true,
						})
					);

					set({
						cart: {
							...response.data.cart,
							items: updateCartItems,
						},
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

			addToCart: async (item: CartItemPayload, userId?: string | null) => {
				set({ isLoading: true });
				try {
					const { cart } = get();

					// If cart exists
					// Check for existing item
					if (cart) {
						const existingItemIndex = cart?.items.findIndex(
							(i) => i.pizza._id === item.pizza && i.size === item.size
						);

						if (existingItemIndex > -1) {
							return {
								success: false,
								message: "Pizza already exists in cart",
							};
						}
					}

					let response;
					let newItem: CartItemType;

					// Authenticated User
					if (userId) {
						const payload = {
							item,
						};

						response = await axios.post(`${API_INITIAL_URL}/items`, payload);

						newItem = {
							...response.data.cartItem,
							isSynced: true,
						};
					} else {
						// GUEST USER
						// Persist in Local Storage
						if (typeof item.pizza !== "string") {
							const basePrice =
								item.pizza.price * sizeMultiplier[item.size ?? "medium"];
							const totalPrice = basePrice * (item.quantity ?? 1);

							newItem = {
								//Mongoose compatible Id
								_id: new ObjectId().toString(),
								...item,
								pizza: item.pizza,
								basePrice,
								totalPrice,
								isSynced: false,
							};
						}
					}

					set((state) => {
						// If cart doesn't exist [First Item]
						if (!state.cart) {
							return {
								...state,
								cart: {
									_id: new ObjectId().toString(), // temporary ID
									items: [newItem],
									cartTotalPrice: newItem.totalPrice,
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							};
						}

						const updatedItems = [...state.cart.items, newItem];
						const cartTotalPrice = updatedItems.reduce(
							(total, i) => total + i.totalPrice,
							0
						);

						return {
							...state,
							cart: {
								...state.cart,
								items: updatedItems,
								cartTotalPrice,
							},
						};
					});

					return {
						success: response?.data.success ?? true,
						message: response?.data.message ?? "Pizza added to cart",
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			updateCart: async (
				itemId: string,
				quantity: number,
				userId: string | null
			) => {
				set({ isLoading: true });
				try {
					const { cart } = get();

					// If cart doesn't exist or is empty
					if (!cart || !cart.items) {
						set({ isLoading: false });
						return {
							success: false,
							message: "Nothing to update in cart",
						};
					}

					// Authenticated User
					let response;
					if (userId) {
						response = await axios.put(`${API_INITIAL_URL}/items/${itemId}`, {
							quantity,
						});
					}

					// GUEST USER
					// Persist in Local Storage
					set((state) => {
						// If cart doesn't exist
						if (!state.cart) return state;

						const updatedItems = state.cart.items.map((item) => {
							if (item._id === itemId) {
								return {
									...item,
									quantity,
									totalPrice: item.basePrice * quantity,
								};
							}
							return item;
						});
						const cartTotalPrice = updatedItems.reduce(
							(total, i) => total + i.totalPrice,
							0
						);

						return {
							...state,
							cart: {
								...state.cart,
								items: updatedItems,
								cartTotalPrice,
							},
						};
					});

					return {
						success: response?.data.success ?? true,
						message: response?.data.message ?? "Item updated",
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			removeFromCart: async (itemId: string, userId: string | null) => {
				set({ isLoading: true });
				try {
					const { cart } = get();

					// If cart doesn't exist or is empty
					if (!cart || !cart.items) {
						set({ isLoading: false });
						return {
							success: false,
							message: "Nothing to delete in cart",
						};
					}

					// Authenticated User
					let response;

					if (userId) {
						response = await axios.delete(`${API_INITIAL_URL}/items/${itemId}`);
					}

					set((state) => {
						// If cart doesn't exist
						if (!state.cart) return state;

						const updatedItems = state.cart.items.filter(
							(item) => item._id !== itemId
						);
						const cartTotalPrice = updatedItems.reduce(
							(total, i) => total + i.totalPrice,
							0
						);

						return {
							...state,
							cart: {
								...state.cart,
								items: updatedItems,
								cartTotalPrice,
							},
						};
					});

					return {
						success: response?.data.success ?? true,
						message: response?.data.message ?? "Item removed from cart",
					};
				} catch (error) {
					return handleZustandError(error);
				} finally {
					set({ isLoading: false });
				}
			},

			clearCart: async (userId: string | null) => {
				set({ isLoading: true });
				try {
					const { cart } = get();

					// If cart doesn't exist or is empty
					if (!cart || !cart.items) {
						set({ isLoading: false });
						return {
							success: false,
							message: "Nothing to delete in cart",
						};
					}

					let response;

					if (userId) {
						console.log(userId);

						response = await axios.delete(`${API_INITIAL_URL}/items`);
					}
					set((state) => {
						// If cart doesn't exist
						if (!state.cart) return state;

						return {
							cart: {
								...state.cart,
								items: [],
								cartTotalPrice: 0,
							},
						};
					});
					return {
						success: response?.data.success ?? true,
						message: response?.data.message ?? "Cart cleared",
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
						cart: null,
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
				cart: state.cart,
			}),
		}
	)
);
