import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { IngredientCategory } from "@/types/IngredientState";
import {
	IngredientQuickFormType,
	ingredientQuickSchema,
} from "@/schemas/ingredient.schema";
import { useIngredientStore } from "@/store/useIngredientStore";

const UpdateCartForm = ({
	ingredientId,
	ingredientType,
	initialPrice,
	initialStock,
}: {
	ingredientId: string;
	ingredientType: IngredientCategory;
	initialPrice: number;
	initialStock: number;
}) => {
	const updateIngredient = useIngredientStore(
		(state) => state.updateIngredient
	);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastSubmittedData, setLastSubmittedData] = useState({
		price: initialPrice,
		stock: initialStock,
	});

	const form = useForm<IngredientQuickFormType>({
		resolver: zodResolver(ingredientQuickSchema),
		defaultValues: {
			price: initialPrice,
			stock: initialStock,
		},
	});

	// Update cart function
	const handleUpdateIngredient = async (
		price?: number,
		stock?: number
	): Promise<void> => {
		if (!price && !stock) return;

		try {
			setIsSubmitting(true);

			let hasUpdates = false;
			const formData = new FormData();

			if (price) {
				if (!isSubmitting && price !== lastSubmittedData.price) {
					formData.append("price", price.toString());
					hasUpdates = true;
				}
			}

			if (stock) {
				if (!isSubmitting && stock !== lastSubmittedData.stock) {
					formData.append("stock", stock.toString());
					hasUpdates = true;
				}
			}

			if (!hasUpdates) return;

			const response = await updateIngredient(
				ingredientId,
				ingredientType,
				formData
			);

			if (response.success) {
				toast.success(response.message);

				const updates: { price?: number; stock?: number } = {};
				if (price) updates.price = price;
				if (stock) updates.stock = stock;

				setLastSubmittedData((prev) => ({ ...prev, ...updates }));
			} else {
				toast.error(response.message);
				// Reset to last successful quantity on error
				form.setValue("price", lastSubmittedData.price);
				form.setValue("stock", lastSubmittedData.stock);
			}
		} catch (error) {
			toast.error("Failed to update cart item");
			console.error(error);
			// Reset to last successful quantity on error
			form.setValue("price", lastSubmittedData.price);
			form.setValue("stock", lastSubmittedData.stock);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Debounced update function to avoid too many API calls
	const debouncedUpdateIngredient = useCallback(
		debounce((price?: number, stock?: number) => {
			if (price) handleUpdateIngredient(price, undefined);
			if (stock) handleUpdateIngredient(undefined, stock);
		}, 500), // 500ms delay
		[ingredientId, lastSubmittedData, isSubmitting]
	);

	// Watch for price and stock changes and trigger update
	useEffect(() => {
		const priceSubscription = form.watch((value, { name }) => {
			if (name === "price" && value.price !== undefined) {
				const price = Number(value.price);
				if (price > 0 && price !== lastSubmittedData.price) {
					debouncedUpdateIngredient(price, undefined);
				}
			}
		});

		const stockSubscription = form.watch((value, { name }) => {
			if (name === "stock" && value.stock !== undefined) {
				const stock = Number(value.stock);
				if (stock > 0 && stock !== lastSubmittedData.stock) {
					debouncedUpdateIngredient(undefined, stock);
				}
			}
		});

		return () => {
			priceSubscription.unsubscribe();
			stockSubscription.unsubscribe();
		};
	}, [form, debouncedUpdateIngredient, lastSubmittedData]);

	// Update form when initial prop changes
	useEffect(() => {
		if (initialPrice !== lastSubmittedData.price) {
			form.setValue("price", initialPrice);
			setLastSubmittedData((prev) => ({ ...prev, price: initialPrice }));
		}

		if (initialStock !== lastSubmittedData.stock) {
			form.setValue("stock", initialStock);
			setLastSubmittedData((prev) => ({ ...prev, stock: initialStock }));
		}
	}, [initialPrice, initialStock, form, lastSubmittedData]);

	// Cleanup debounced function on unmount
	useEffect(() => {
		return () => {
			debouncedUpdateIngredient.cancel();
		};
	}, [debouncedUpdateIngredient]);

	return (
		<div
			className="flex flex-col justify-end items-center pt-4"
			onClick={(event) => {
				event.stopPropagation();
			}}
		>
			<Form {...form}>
				<form>
					<div className="flex justify-between items-center gap-4">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text pl-1">
										Price (₹)
										{isSubmitting && (
											<span className="ml-2 text-xs text-muted-foreground">
												Updating...
											</span>
										)}
									</FormLabel>
									<FormControl>
										<input
											className="w-20 border-1 bg-input/40 rounded-lg py-1.5 pl-4 disabled:opacity-50"
											type="number"
											placeholder="Enter price"
											min={1}
											disabled={isSubmitting}
											{...field}
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												const value = e.target.value;
												// Allow empty string for better UX while typing
												field.onChange(value === "" ? "" : Number(value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="stock"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text pl-1">
										Stock
										{isSubmitting && (
											<span className="ml-2 text-xs text-muted-foreground">
												Updating...
											</span>
										)}
									</FormLabel>
									<FormControl>
										<input
											className="w-20 border-1 bg-input/40 rounded-lg py-1.5 pl-4 disabled:opacity-50"
											type="number"
											placeholder="Enter stock"
											min={0}
											disabled={isSubmitting}
											{...field}
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												const value = e.target.value;
												// Allow empty string for better UX while typing
												field.onChange(value === "" ? "" : Number(value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default UpdateCartForm;
