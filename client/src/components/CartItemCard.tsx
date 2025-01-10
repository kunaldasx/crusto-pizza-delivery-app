import { CartItemType } from "@/types/CartState";
import { Badge } from "./ui/badge";
import UpdateCartItemForm from "./forms/UpdateCartItemForm";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import pizza_placeholder from "../assets/images/pizza-placeholder.png";

const CartItemCard = ({ item }: { item: CartItemType }) => {
	const user = useAuthStore((state) => state.user);
	const removeFromCart = useCartStore((state) => state.removeFromCart);

	const selectedIngredients = [
		item.pizza.base,
		item.pizza.sauce,
		...(item.pizza.cheese ?? []),
		...(item.pizza.veggie ?? []),
		...(item.pizza.extra ?? []),
	];

	const handleRemoveItem = async () => {
		const response = await removeFromCart(item._id, user?._id ?? null);

		response.success
			? toast.success(response.message)
			: toast.error(response.message);
	};

	return (
		<div className="bg-card w-full flex max-md:flex-col justify-center items-start gap-4 rounded-lg py-4 px-4">
			<img
				src={item.pizza.images?.[0] ?? pizza_placeholder}
				alt="pizza image"
				className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-lg object-cover"
			/>

			<div className="bg-card flex-1 flex flex-col justify-center items-start gap-4">
				<div className="relative w-full flex justify-start items-center gap-2">
					<button
						onClick={handleRemoveItem}
						className="absolute top-0 right-0 p-2 rounded-lg hover:bg-destructive transition-colors duration-200"
					>
						<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
					</button>

					<div className="flex-1 flex flex-col justify-center items-start gap-2">
						<h2 className="text-xl font-semibold tracking-wide text-heading">
							{item.pizza.name}
						</h2>
						<div className="flex justify-start items-center gap-8">
							<p className="text-md font-semibold tracking-wide text-subtitle">
								₹ {item.basePrice.toFixed(2)}
							</p>

							<Badge className="text-xs capitalize">
								{item.pizza.category}
							</Badge>
						</div>
					</div>
				</div>

				{item.pizza.description && (
					<p className="w-full max-h-[2.6rem] overflow-hidden overflow-ellipsis text-sm text-text">
						{item.pizza.description}
					</p>
				)}

				<div className="w-full flex justify-start items-center gap-2 flex-wrap overflow-hidden">
					{selectedIngredients.map(
						(ingredient) =>
							ingredient && (
								<Badge
									key={ingredient._id}
									variant="outline"
									className="text-xs capitalize"
								>
									{ingredient.name}
								</Badge>
							)
					)}
				</div>

				{item.pizza.isAvailable ? (
					<div className="w-full flex justify-start items-start gap-8 mt-4 ml-1.5">
						<div className="flex flex-col justify-center items-start">
							<p className="text-sm text-text">Size:</p>
							<p className="text-sm font-semibold text-foreground capitalize tracking-wider">
								{item.size}
							</p>
						</div>
						<UpdateCartItemForm
							itemId={item._id}
							itemQuantity={item.quantity}
						/>
					</div>
				) : (
					<p className="w-full btn-muted">Not Available</p>
				)}
			</div>
		</div>
	);
};

export default CartItemCard;
