import { UpdateCartFormType, updateCartSchema } from "@/schemas/cart.schema";
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
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { debounce } from "lodash";

const UpdateCartItemForm = ({
	itemId,
	itemQuantity,
}: {
	itemId: string;
	itemQuantity: number;
}) => {
	const user = useAuthStore((state) => state.user);
	const updateCart = useCartStore((state) => state.updateCart);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastSubmittedQuantity, setLastSubmittedQuantity] =
		useState(itemQuantity);

	const form = useForm<UpdateCartFormType>({
		resolver: zodResolver(updateCartSchema),
		defaultValues: {
			quantity: itemQuantity,
		},
	});

	// Update cart function
	const handleUpdateCart = async (quantity: number): Promise<void> => {
		if (quantity === lastSubmittedQuantity || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);

			const response = await updateCart(itemId, quantity, user?._id ?? null);

			if (response.success) {
				toast.success(response.message);
				setLastSubmittedQuantity(quantity);
			} else {
				toast.error(response.message);
				// Reset to last successful quantity on error
				form.setValue("quantity", lastSubmittedQuantity);
			}
		} catch (error) {
			toast.error("Failed to update cart item");
			console.error(error);
			// Reset to last successful quantity on error
			form.setValue("quantity", lastSubmittedQuantity);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Debounced update function to avoid too many API calls
	const debouncedUpdateCart = useCallback(
		debounce((quantity: number) => {
			handleUpdateCart(quantity);
		}, 500), // 500ms delay
		[itemId, lastSubmittedQuantity, isSubmitting]
	);

	// Watch for quantity changes and trigger update
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "quantity" && value.quantity !== undefined) {
				const quantity = Number(value.quantity);
				if (quantity > 0 && quantity !== lastSubmittedQuantity) {
					debouncedUpdateCart(quantity);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form, debouncedUpdateCart, lastSubmittedQuantity]);

	// Update form when itemQuantity prop changes
	useEffect(() => {
		if (itemQuantity !== lastSubmittedQuantity) {
			form.setValue("quantity", itemQuantity);
			setLastSubmittedQuantity(itemQuantity);
		}
	}, [itemQuantity, form, lastSubmittedQuantity]);

	// Cleanup debounced function on unmount
	useEffect(() => {
		return () => {
			debouncedUpdateCart.cancel();
		};
	}, [debouncedUpdateCart]);

	return (
		<div
			className="px-4 flex flex-col justify-end items-center"
			onClick={(event) => {
				event.stopPropagation();
			}}
		>
			<Form {...form}>
				<form className="w-full">
					<div className="w-full flex justify-between items-center gap-4 mb-4">
						<FormField
							control={form.control}
							name="quantity"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text pl-1">
										Quantity
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
											placeholder="Enter quantity"
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
					</div>
				</form>
			</Form>
		</div>
	);
};

export default UpdateCartItemForm;
