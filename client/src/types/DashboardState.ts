import { StoreResultType } from "./StoreResultType";

export enum ActivityCategory {
	Signup = "signup",
	Order = "order",
}

export interface ActivityType {
	type: ActivityCategory;
	username: string;
	timestamp: Date;
	metadata?: {
		orderId: string;
		totalItems: number;
		price: number;
	};
}

export interface AnalyticsType {
	totalUsers: number;
	totalOrders: number;
	totalRevenue: number;
	recentActivity: ActivityType[];
}

export interface DashboardStoreType {
	analytics: AnalyticsType | null;
	isLoading: boolean;
}

interface DashboardActionsType {
	getAnalytics: () => Promise<StoreResultType>;
	addActivity: (activity: ActivityType) => Promise<StoreResultType>;
}

export type DashboardState = DashboardStoreType & DashboardActionsType;
