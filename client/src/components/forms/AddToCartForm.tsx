import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useCartStore } from "@/store/useCartStore";
import { AddToCartFormType, addToCartSchema } from "@/schemas/cart.schema";
import { CartItemPayload, SizeCategory } from "@/types/CartState";
import { useEffect, useState } from "react";
import { sizeMultiplier } from "@/lib/utils";
import { PizzaType } from "@/types/PizzaState";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useNavigate } from "react-router-dom";

const AddToCartForm = ({
	setTotalPrice,
	pizza,
}: {
	setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
	pizza: PizzaType;
}) => {
	const navigate = useNavigate();

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);

	const addToCart = useCartStore((state) => state.addToCart);
	const isLoadingCart = useCartStore((state) => state.isLoading);
	const cart = useCartStore((state) => state.cart);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAlreadyInCart, setIsAlreadyInCart] = useState(false);

	const form = useForm<AddToCartFormType>({
		resolver: zodResolver(addToCartSchema),
		defaultValues: {
			size: "medium",
			quantity: 1,
		},
	});

	// Watch size and quantity fields
	const size = useWatch({ control: form.control, name: "size" });
	const quantity = useWatch({ control: form.control, name: "quantity" });

	useEffect(() => {
		if (!isLoadingCart && cart?.items.length) {
			const alreadyExists = cart.items.find(
				(existingItem) =>
					existingItem.pizza._id === pizza._id && existingItem.size === size
			)
				? true
				: false;

			setIsAlreadyInCart(alreadyExists);
		}
	}, [cart, size]);

	// Assume some base pricing logic (customize as needed)
	useEffect(() => {
		const basePrice = pizza.price * sizeMultiplier[size ?? "medium"];
		const totalPrice = basePrice * (quantity ?? 1);
		setTotalPrice(totalPrice);
	}, [size, quantity]);

	// Add To Cart
	const handleAddToCart = async (): Promise<void> => {
		try {
			setIsSubmitting(true);

			let cartItemPayload: CartItemPayload;

			if (isAuthenticated) {
				cartItemPayload = {
					pizza: pizza._id,
					size: size as SizeCategory,
					quantity,
				};
			} else {
				cartItemPayload = {
					pizza,
					size: size as SizeCategory,
					quantity,
				};
			}

			const response = await addToCart(cartItemPayload, user?._id ?? null);

			if (response.success) {
				toast.success(response.message);
				setIsAlreadyInCart(true);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Failed to add item to cart");
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="w-full flex flex-col justify-end items-center"
			onClick={(event) => {
				event.stopPropagation();
			}}
		>
			<Form {...form}>
				<form className="w-full" onSubmit={form.handleSubmit(handleAddToCart)}>
					{/* Size (Dropdown/Select) */}
					<div className="w-full flex justify-start items-center gap-4 mb-2">
						<FormField
							control={form.control}
							name="size"
							render={({ field }) => (
								<FormItem className="flex-2">
									<FormLabel className="text pl-1">Size</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<SelectTrigger className="w-full border-border">
												<SelectValue placeholder="Select a size" />
											</SelectTrigger>
											<SelectContent className="z-150">
												<SelectGroup>
													<SelectLabel>Size</SelectLabel>
													<SelectItem value="small">Small</SelectItem>
													<SelectItem value="medium">Medium</SelectItem>
													<SelectItem value="large">Large</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Quantity (Number input) */}
						<FormField
							control={form.control}
							name="quantity"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text pl-1">Quantity</FormLabel>
									<FormControl>
										<input
											className="w-full border-1 bg-input/40 rounded-lg py-1.5 pl-4"
											type="number"
											placeholder="Enter quantity"
											min={1}
											{...field}
											{...form.register("quantity", { valueAsNumber: true })}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Add to cart button */}
					{!pizza.isAvailable ? (
						<div className="w-full mb-4 btn-muted">Not Available</div>
					) : isAlreadyInCart ? (
						<button
							type="button"
							onClick={() => navigate("/cart")}
							className="w-full mb-4 btn-secondary"
						>
							<span>Go to cart</span>
						</button>
					) : (
						<button
							className="w-full mb-4 btn-primary"
							type="submit"
							disabled={isLoadingCart || isSubmitting || !pizza.isAvailable}
						>
							{isSubmitting ? (
								<Loader className="w-6 h-6 animate-spin mx-auto" />
							) : (
								"Add to Cart"
							)}
						</button>
					)}
				</form>
			</Form>
		</div>
	);
};
export default AddToCartForm;
