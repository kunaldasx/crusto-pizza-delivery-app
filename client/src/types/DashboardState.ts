import { StoreResultType } from "./StoreResultType";

export enum ActivityCategory {
	Signup = "signup",
	Order = "order",
	Stock = "stock",
}

export interface ActivityType {
	type: ActivityCategory;
	name: string;
	timestamp: Date;
	metadata?: {
		id: string;
		count: number;
		price?: number;
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
