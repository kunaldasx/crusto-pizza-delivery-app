import { AddressType, UserType } from "@/types/AuthState";
import { isEqual } from "lodash";

export const getDefaultValuesFromUser = (user: UserType | null) => {
	if (!user) {
		return {
			username: "",
			email: "",
			profileImage: undefined,
			addresses: [],
			defaultAddressIndex: "0",
		};
	}

	let defaultIndex;

	if (user.addresses?.length && user.defaultAddress) {
		const { _id, phone, altPhone, ...rest } = user.defaultAddress!;
		const defaultAddress = {
			...rest,
			phone: { countryCode: phone.countryCode, number: phone.number },
			altPhone: altPhone?.number
				? { countryCode: altPhone.countryCode, number: altPhone.number }
				: undefined,
		};

		const stripId = (address: AddressType) => {
			const { _id, phone, altPhone, ...rest } = address;

			return {
				...rest,
				phone: { countryCode: phone.countryCode, number: phone.number },
				altPhone: altPhone?.number
					? { countryCode: altPhone.countryCode, number: altPhone.number }
					: undefined,
			};
		};

		defaultIndex = user.addresses?.findIndex((addr) => {
			return isEqual(stripId(addr), defaultAddress);
		});
	}

	return {
		username: user.username,
		email: user.email,
		profileImage: undefined,
		addresses: user.addresses || [],
		defaultAddressIndex:
			defaultIndex !== -1 && defaultIndex != null
				? defaultIndex.toString()
				: "0",
	};
};
