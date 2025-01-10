import { CustomPizzaFormType } from "@/schemas/customPizza.schema";
import {
	CustomPizzaPayload,
	ImageState,
	IngredientsMap,
} from "@/types/CustomPizzaState";
import { IngredientType } from "@/types/IngredientState";

export function convertFormDataToObject(
	pizzaData: FormData,
	ingredients: IngredientsMap,
	updateMode: true
): Partial<CustomPizzaPayload>;

export function convertFormDataToObject(
	pizzaData: FormData,
	ingredients: IngredientsMap,
	updateMode?: false
): CustomPizzaPayload;

export function convertFormDataToObject(
	pizzaData: FormData,
	ingredients: IngredientsMap,
	updateMode: boolean = false
): CustomPizzaPayload | Partial<CustomPizzaPayload> {
	const {
		base: baseOptions,
		sauce: sauceOptions,
		cheese: cheeseOptions,
		veggie: veggieOptions,
		extra: extraOptions,
	} = ingredients;

	const extractIngredients = (
		ids: FormDataEntryValue[],
		options: IngredientType[]
	) =>
		ids
			.map((id) => options.find((item) => item._id === id))
			.filter((item): item is IngredientType => item !== undefined);

	const cheese = extractIngredients(pizzaData.getAll("cheese"), cheeseOptions);
	const veggie = extractIngredients(pizzaData.getAll("veggie"), veggieOptions);
	const extra = extractIngredients(pizzaData.getAll("extra"), extraOptions);

	const name = pizzaData.get("name")?.toString();
	const description = pizzaData.get("description")?.toString();

	const baseId = pizzaData.get("base")?.toString();
	const sauceId = pizzaData.get("sauce")?.toString();

	const base = baseOptions.find((item) => item._id === baseId);
	const sauce = sauceOptions.find((item) => item._id === sauceId);

	const hasValue = (value: any): boolean => {
		if (value === undefined || value === null || value === "") return false;
		if (Array.isArray(value)) return value.length > 0;
		return true;
	};

	if (updateMode) {
		let payload: Partial<CustomPizzaPayload> = {};

		if (hasValue(name)) payload.name = name;
		if (hasValue(description)) payload.description = description;
		if (hasValue(base)) payload.base = base;
		if (hasValue(sauce)) payload.sauce = sauce;
		if (hasValue(cheese)) payload.cheese = cheese;
		if (hasValue(veggie)) payload.veggie = veggie;
		if (hasValue(extra)) payload.extra = extra;

		return payload;
	}

	// STRICT checks in create mode
	if (!name) throw new Error("Pizza name is required.");
	if (!base) throw new Error("Valid base is required.");
	if (!sauce) throw new Error("Valid sauce is required.");

	let payload: CustomPizzaPayload = {
		name,
		base,
		sauce,
	};

	if (hasValue(description)) payload.description = description;
	if (hasValue(cheese)) payload.cheese = cheese;
	if (hasValue(veggie)) payload.veggie = veggie;
	if (hasValue(extra)) payload.extra = extra;

	return payload;
}

// Initialize imageStates based on existing pizza images
export const initializeImageStates = (
	images: string[] | undefined
): ImageState[] => {
	if (images) {
		return images.map((url, index) => ({
			id: `existing-${index}`,
			url,
			status: "existing" as const,
		}));
	}
	return [];
};

// Helper function to detect changes for updates
export const getChangedFields = (
	currentValues: CustomPizzaFormType,
	originalValues: CustomPizzaFormType
) => {
	if (!originalValues) return currentValues;

	const changes: Partial<CustomPizzaFormType> = {};

	// Helper function to check if arrays are different
	const arraysAreDifferent = (arr1: string[], arr2: string[]) => {
		if (arr1.length !== arr2.length) return true;
		const sorted1 = [...arr1].sort();
		const sorted2 = [...arr2].sort();
		return JSON.stringify(sorted1) !== JSON.stringify(sorted2);
	};

	// Check each field individually for type safety
	if (currentValues.name !== originalValues.name) {
		changes.name = currentValues.name;
	}

	if (currentValues.description !== originalValues.description) {
		changes.description = currentValues.description;
	}

	if (currentValues.base !== originalValues.base) {
		changes.base = currentValues.base;
	}

	if (currentValues.sauce !== originalValues.sauce) {
		changes.sauce = currentValues.sauce;
	}

	if (
		currentValues.cheese &&
		originalValues.cheese &&
		arraysAreDifferent(currentValues.cheese, originalValues.cheese)
	) {
		changes.cheese = currentValues.cheese;
	}

	if (
		currentValues.veggie &&
		originalValues.veggie &&
		arraysAreDifferent(currentValues.veggie, originalValues.veggie)
	) {
		changes.veggie = currentValues.veggie;
	}

	if (
		currentValues.extra &&
		originalValues.extra &&
		arraysAreDifferent(currentValues.extra, originalValues.extra)
	) {
		changes.extra = currentValues.extra;
	}

	return changes;
};

// Create FormData for file uploads using ImageState
export const createFormData = (
	data: CustomPizzaFormType | Partial<CustomPizzaFormType>,
	imageStates: ImageState[]
) => {
	const formData = new FormData();

	// Add text fields only if they have actual values
	Object.entries(data).forEach(([key, value]) => {
		if (key === "images") return; // Handle images separately

		// Skip undefined, null, empty strings, and empty arrays
		if (value === undefined || value === null || value === "") return;

		if (Array.isArray(value)) {
			// For arrays, only append if array has items and items aren't empty
			const filteredArray = value.filter(
				(item) => item !== undefined && item !== null && item !== ""
			);

			if (filteredArray.length > 0) {
				filteredArray.forEach((item) => {
					formData.append(key, item);
				});
			}
		} else {
			// For non-arrays, append the value
			formData.append(key, String(value));
		}
	});

	// Add new image files
	const newImages = imageStates.filter((state) => state.status === "new");
	newImages.forEach((imageState) => {
		if (imageState.file) {
			formData.append("images", imageState.file);
		}
	});

	// For updates, include existing image URLs that weren't deleted
	const existingImages = imageStates.filter(
		(state) => state.status === "existing"
	);
	if (existingImages.length > 0) {
		existingImages.forEach((imageState) => {
			formData.append("existingImages[]", imageState.url);
		});
	}

	// For updates, include deleted image URLs to remove from cloudinary
	const deletedImages = imageStates.filter(
		(state) => state.status === "deleted"
	);
	if (deletedImages.length > 0) {
		deletedImages.forEach((imageState) => {
			formData.append("deletedImages[]", imageState.url);
		});
	}

	return formData;
};
