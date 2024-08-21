import { Badge } from "./ui/badge";

import pizza_placeholder from "../assets/images/pizza-placeholder.png";
import { OrderItemType } from "@/types/OrderState";
import { AspectRatio } from "./ui/aspect-ratio";

const OrderItemCard = ({ item }: { item: OrderItemType }) => {
	return (
		<div className="bg-card w-full flex justify-center items-start gap-4 rounded-lg py-4 px-4">
			<div className="flex-1">
				<AspectRatio ratio={1 / 1}>
					<img
						src={item.images?.[0] ?? pizza_placeholder}
						alt="pizza image"
						className="w-full h-full rounded-lg object-cover"
					/>
				</AspectRatio>
			</div>
			<div className="bg-card flex-2 flex flex-col justify-center items-start gap-4">
				<div className="relative w-full flex justify-start items-center gap-2">
					<div className="flex-1 flex flex-col justify-center items-start gap-2">
						<h2 className="text-xl font-semibold tracking-wide text-heading">
							{item.name}
						</h2>
						<div className="flex justify-start items-center gap-8">
							<p className="text-md font-semibold tracking-wide text-subtitle">
								₹ {item.totalPrice.toFixed(2)}
							</p>

							<Badge className="text-xs capitalize">{item.category}</Badge>
						</div>
					</div>
				</div>

				{item.description && (
					<p className="w-full max-h-[2.6rem] overflow-hidden overflow-ellipsis text-sm text-text">
						{item.description}
					</p>
				)}

				<div className="w-full flex justify-start items-center gap-2 flex-wrap overflow-hidden">
					{item.selectedIngredients.map(
						(ingredient, idx) =>
							ingredient && (
								<Badge
									key={idx}
									variant="outline"
									className="text-xs capitalize"
								>
									{ingredient}
								</Badge>
							)
					)}
				</div>

				<div className="w-full flex justify-start items-start gap-8 mt-4 ml-1.5">
					<div className="flex flex-col justify-center items-start">
						<p className="text-sm text-text">Size:</p>
						<p className="text-sm font-semibold text-foreground capitalize">
							{item.size}
						</p>
					</div>
					<div className="flex flex-col justify-center items-start">
						<p className="text-sm text-text">Quantity:</p>
						<p className="text-sm font-semibold text-foreground capitalize">
							{item.quantity}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderItemCard;
