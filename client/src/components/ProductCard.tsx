import { useEffect, useRef, useState } from "react";
import RatingStars from "./widgets/RatingStars";
import { Badge } from "./ui/badge";
import { PizzaType } from "@/types/PizzaState";
import pizza_placeholder from "../assets/images/pizza-placeholder.png";
import AddToCartForm from "./forms/AddToCartForm";

const ProductCard = ({
	pizza,
	rating,
	onView,
	isMenuProduct = false,
}: {
	pizza: PizzaType;
	rating?: { star: number; review: number };
	onView: () => void;
	isMenuProduct?: boolean;
}) => {
	const selectedIngredients = [
		pizza.base,
		pizza.sauce,
		...(pizza.cheese ?? []),
		...(pizza.veggie ?? []),
		...(pizza.extra ?? []),
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const startSlideshow = () => {
		if (!pizza.images?.length || timerRef.current) return; // prevent multiple timers

		timerRef.current = setInterval(() => {
			setCurrentIndex((prev: number) => (prev + 1) % pizza.images!.length);
		}, 1000);
	};

	const stopSlideshow = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setCurrentIndex(0); // Reset to first image
	};

	useEffect(() => {
		return () => {
			// Cleanup on unmount
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	// Total Price of pizza after adding size and quantity

	const [totalPrice, setTotalPrice] = useState(0);

	return (
		<>
			<div
				className="h-full w-full cursor-pointer"
				onClick={onView}
				onMouseEnter={startSlideshow}
				onMouseLeave={stopSlideshow}
			>
				<div className="w-full h-[200px] relative overflow-hidden">
					<img
						src={pizza.images?.[currentIndex] ?? pizza_placeholder}
						alt={pizza.name}
						className="w-full h-full object-cover"
					/>

					{pizza.badge && (
						<Badge className="absolute top-2.5 right-2.5">{pizza.badge}</Badge>
					)}
				</div>

				<div className="w-full flex flex-col justify-center items-center gap-2 p-4">
					<div className="w-full flex justify-between items-start gap-2 text-lg font-semibold">
						<p className="text-heading font-bold text-lg tracking-wide">
							{pizza.name}
						</p>
						<p className="text-subtitle font-bold text-lg tracking-wide whitespace-nowrap">
							₹ {isMenuProduct ? pizza.price.toFixed(2) : totalPrice.toFixed(2)}
						</p>
					</div>

					{pizza.category && (
						<div className="w-full">
							<Badge className="text-[10px] capitalize">{pizza.category}</Badge>
						</div>
					)}

					<div className="w-full">
						<p className="w-full max-h-[2.2rem] overflow-hidden overflow-ellipsis text-xs text-text">
							{pizza.description}
						</p>
					</div>

					<div className="w-full max-h-[3.5rem] flex justify-start items-center gap-2 flex-wrap overflow-hidden">
						{selectedIngredients.map(
							(ingredient) =>
								ingredient && (
									<Badge
										key={ingredient._id}
										variant="outline"
										className="text-[10px] capitalize"
									>
										{ingredient.name}
									</Badge>
								)
						)}
					</div>

					{rating && (
						<div className="w-full flex justify-start items-center flex-wrap gap-2">
							<RatingStars rating={rating.star} />
							<p className="text-xs text-muted-foreground">
								({rating.review} reviews)
							</p>
						</div>
					)}
				</div>
			</div>

			{!isMenuProduct && (
				<div className="w-full px-4 z-10">
					<AddToCartForm setTotalPrice={setTotalPrice} pizza={pizza} />
				</div>
			)}
		</>
	);
};

export default ProductCard;
