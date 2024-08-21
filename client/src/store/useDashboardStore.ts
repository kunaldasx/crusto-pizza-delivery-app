import { handleZustandError } from "@/lib/utils";
import { ActivityType, DashboardState } from "@/types/DashboardState";
import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${import.meta.env.VITE_API_INITIAL_URL}/api/dashboard`;

export const useDashboardStore = create<DashboardState>((set) => ({
	analytics: null,
	isLoading: false,

	getAnalytics: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_INITIAL_URL}/`);

			set({
				analytics: response.data.analytics,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	addActivity: async (activity: ActivityType) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/`, activity);

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
