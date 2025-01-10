import { handleZustandError } from "@/lib/utils";
import {
	IngredientCategory,
	IngredientState,
	IngredientType,
} from "@/types/IngredientState";
import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${
	import.meta.env.VITE_API_INITIAL_URL
}/api/ingredient`;

export const useIngredientStore = create<IngredientState>((set) => ({
	ingredients: [],
	base: [],
	sauce: [],
	cheese: [],
	veggie: [],
	extra: [],
	isLoading: false,

	getAllIngredients: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_INITIAL_URL}/`);
			const ingredients = response.data.ingredients;

			const base: IngredientType[] = [];
			const sauce: IngredientType[] = [];
			const cheese: IngredientType[] = [];
			const veggie: IngredientType[] = [];
			const extra: IngredientType[] = [];

			ingredients.forEach((ingredient: IngredientType) => {
				switch (ingredient.type) {
					case IngredientCategory.Base:
						base.push(ingredient);
						break;
					case IngredientCategory.Sauce:
						sauce.push(ingredient);
						break;
					case IngredientCategory.Cheese:
						cheese.push(ingredient);
						break;
					case IngredientCategory.Veggie:
						veggie.push(ingredient);
						break;
					case IngredientCategory.Extra:
						extra.push(ingredient);
						break;
				}
			});

			set({
				ingredients,
				base,
				sauce,
				cheese,
				veggie,
				extra,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	createIngredient: async (ingredientData: FormData) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/`, ingredientData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			const type = response.data.ingredient.type as IngredientCategory;

			set((state) => ({
				ingredients: [...state.ingredients, response.data.ingredient],
				[type]: [...state[type], response.data.ingredient],
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	updateIngredient: async (
		id: string,
		type: IngredientCategory,
		ingredientData: FormData
	) => {
		set({ isLoading: true });
		try {
			const response = await axios.put(
				`${API_INITIAL_URL}/${id}`,
				ingredientData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			// Name, Price or Stock are updated
			set((state) => ({
				ingredients: state.ingredients.map((item) =>
					item._id === id ? response.data.ingredient : item
				),
				[type]: state[type].map((item) =>
					item._id === id ? response.data.ingredient : item
				),
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	deleteIngredient: async (id: string, type: IngredientCategory) => {
		set({ isLoading: true });
		try {
			const response = await axios.delete(`${API_INITIAL_URL}/${id}`);

			set((state) => ({
				ingredients: state.ingredients.map((item) =>
					item._id === id ? { ...item, isDeleted: true } : item
				),
				[type]: state[type].map((item) =>
					item._id === id ? { ...item, isDeleted: true } : item
				),
			}));

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	restoreIngredient: async (id: string, type: IngredientCategory) => {
		set({ isLoading: true });
		try {
			const response = await axios.patch(`${API_INITIAL_URL}/${id}`);

			set((state) => ({
				ingredients: state.ingredients.map((item) =>
					item._id === id ? { ...item, isDeleted: false } : item
				),
				[type]: state[type].map((item) =>
					item._id === id ? { ...item, isDeleted: false } : item
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
