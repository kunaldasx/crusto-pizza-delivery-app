import { StoreResultType, UserResultType } from "./StoreResultType";

enum Role {
	Customer = "customer",
	Admin = "admin",
}

interface PhoneType {
	_id: string;
	countryCode: string;
	number: string;
}

export interface AddressType {
	_id: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
	phone: PhoneType;
	altPhone?: PhoneType;
}

export interface UserType {
	_id: string;
	username: string;
	email: string;
	profileImage?: string;
	addresses?: AddressType[];
	defaultAddress?: AddressType;
	role: Role;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface AuthType {
	user: UserType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isCheckingAuth: boolean;
	hasCheckedAuth: boolean;
	intendedRoute: string;
}

interface AuthActionsType {
	signup: (
		email: string,
		password: string,
		name: string
	) => Promise<StoreResultType>;
	login: (email: string, password: string) => Promise<StoreResultType>;
	logout: () => Promise<StoreResultType>;
	verifyEmail: (code: string) => Promise<UserResultType>;
	forgotPassword: (email: string) => Promise<StoreResultType>;
	resetPassword: (token: string, password: string) => Promise<StoreResultType>;
	checkAuth: () => Promise<StoreResultType>;
	updateProfile: (userData: FormData) => Promise<UserResultType>;

	// Redirect Route
	setIntendedRoute: (path: string) => void;
	clearIntendedRoute: () => void;
}

export type AuthState = AuthType & AuthActionsType;

export interface UserPayload {
	username: string;
	email: string;
	profileImg: string;
	addresses: AddressType[];
	defaultAddress: AddressType;
}
