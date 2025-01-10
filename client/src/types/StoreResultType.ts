import { UserType } from "./AuthState";

export interface StoreResultType {
	success: boolean;
	message: string;
}

export interface OrderResultType extends StoreResultType {
	order?: {
		id: string;
		amount: number;
		currency: string;
	};
}

export interface UserResultType extends StoreResultType {
	user?: UserType;
}
