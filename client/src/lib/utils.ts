import { StoreResultType } from "@/types/StoreResultType";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const sizeMultiplier: Record<string, number> = {
	small: 1,
	medium: 1.5,
	large: 2,
};

export const handleZustandError = (error: unknown): StoreResultType => {
	if (axios.isAxiosError(error) && error.response) {
		return {
			success: error.response.data.success || false,
			message: error.response.data.message || "Unexpected error occurred",
		};
	} else {
		return { success: false, message: "Unexpected error occurred" };
	}
};
