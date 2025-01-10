import { create } from "zustand";
import axios from "axios";
import { AuthState } from "@/types/AuthState";
import { handleZustandError } from "@/lib/utils";

axios.defaults.withCredentials = true;

const API_INITIAL_URL = `${import.meta.env.VITE_API_INITIAL_URL}/api/auth`;

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	isCheckingAuth: true,
	hasCheckedAuth: false,

	// Redirect Route
	intendedRoute: "/",
	setIntendedRoute: (path: string) => set({ intendedRoute: path }),
	clearIntendedRoute: () => set({ intendedRoute: "/" }),

	login: async (email: string, password: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/login`, {
				email,
				password,
			});

			set({
				user: response.data.user,
				isAuthenticated: true,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	signup: async (email: string, password: string, username: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/signup`, {
				email,
				password,
				username,
			});

			set({
				user: response.data.user,
				isAuthenticated: true,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	logout: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/logout`);
			set({
				user: null,
				isAuthenticated: false,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	verifyEmail: async (code: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/verify-email`, {
				code,
			});

			set({
				user: response.data.user,
				isAuthenticated: true,
			});

			return {
				user: response.data.user,
				success: response.data.success,
				message: response.data.message,
			};
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	forgotPassword: async (email: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`${API_INITIAL_URL}/forgot-password`, {
				email,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	resetPassword: async (token: string, password: string) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(
				`${API_INITIAL_URL}/reset-password/${token}`,
				{
					password,
				}
			);

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, hasCheckedAuth: false });

		try {
			const response = await axios.get(`${API_INITIAL_URL}/check-auth`);

			set({
				user: response.data.user,
				isAuthenticated: true,
			});

			return { success: response.data.success, message: response.data.message };
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isCheckingAuth: false, hasCheckedAuth: true });
		}
	},

	updateProfile: async (userData: FormData) => {
		set({ isLoading: true });

		try {
			const response = await axios.put(
				`${API_INITIAL_URL}/update-profile`,
				userData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			set({
				user: response.data.user,
				isAuthenticated: true,
			});

			return {
				user: response.data.user,
				success: response.data.success,
				message: response.data.message,
			};
		} catch (error) {
			return handleZustandError(error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
