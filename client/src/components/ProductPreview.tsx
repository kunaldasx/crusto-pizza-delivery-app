import { PizzaType } from "@/types/PizzaState";
import { Edit, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import pizza_placeholder from "../assets/images/pizza-placeholder.png";
import { Badge } from "./ui/badge";
import AddToCartForm from "./forms/AddToCartForm";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Separator } from "./ui/separator";

interface ProductPreviewType {
	pizza: PizzaType;
	isMenuProduct?: boolean;
	handleClosePizza: () => void;
	handleEditPizza?: (pizza: PizzaType) => void;
	handleDeletePizza?: (pizzaId: string) => void;
}

const ProductPreview = ({
	pizza,
	isMenuProduct = false,
	handleClosePizza,
	handleEditPizza,
	handleDeletePizza,
}: ProductPreviewType) => {
	const selectedIngredients = [
		pizza.base,
		pizza.sauce,
		...(pizza.cheese ?? []),
		...(pizza.veggie ?? []),
		...(pizza.extra ?? []),
	];

	const [selectedImageIdx, setSelectedImageIdx] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
				onClick={handleClosePizza}
			/>

			{/* Popover Content */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				transition={{ duration: 0.3 }}
				className="w-[90vw] h-[90vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border-2 rounded-lg shadow-xl z-70 overflow-y-auto"
			>
				<div className="w-full flex max-sm:flex-col justify-center items-start gap-8 py-12 px-6 md:px-12">
					{/* Image Section */}
					<div className="max-sm:w-full flex-1 flex flex-col justify-start items-start gap-4">
						<div className="w-full relative rounded-lg border-2">
							<img
								src={
									pizza.images?.[selectedImageIdx] ??
									pizza_placeholder
								}
								alt="Pizza selected Image"
								className="w-full h-[300px] lg:h-[400px] rounded-lg object-cover"
							/>

							{pizza.badge && (
								<Badge className="absolute top-2.5 right-2.5 capitalize">
									{pizza.badge}
								</Badge>
							)}
						</div>
						<div className="grid grid-cols-3 gap-2 md:gap-4">
							{pizza.images &&
								pizza.images.map((url, index) => (
									<img
										key={url}
										src={url}
										alt="Pizza images"
										className={`h-[100px] w-[150px] rounded-lg object-cover ${
											index === selectedImageIdx &&
											"ring-2 ring-offset-4 ring-offset-black/60 ring-ring"
										}`}
										onClick={() =>
											setSelectedImageIdx(index)
										}
									/>
								))}
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 flex flex-col justify-start items-start gap-6">
						<h2 className="text-3xl lg:text-4xl font-bold text-heading tracking-wide">
							{pizza.name}
						</h2>
						<p className="text-xl lg:text-2xl text-subtitle tracking-wide font-bold">
							₹{" "}
							{isMenuProduct
								? pizza.price.toFixed(2)
								: totalPrice.toFixed(2)}
						</p>

						{pizza.description && (
							<p className=" text-muted-foreground">
								{pizza.description}
							</p>
						)}

						{pizza.category && (
							<div>
								<h4 className="text-sm text-text mb-2 ml-0.5">
									Category
								</h4>
								<Badge className="text-sm capitalize">
									{pizza.category}
								</Badge>
							</div>
						)}

						<div>
							<h4 className="text-sm text-text mb-3 ml-0.5">
								Ingredients
							</h4>
							<div className="w-full flex justify-start items-center gap-2 flex-wrap overflow-hidden">
								{selectedIngredients.map(
									(ingredient) =>
										ingredient && (
											<Badge
												key={ingredient._id}
												variant="outline"
												className="text-sm capitalize"
											>
												{ingredient.name}
											</Badge>
										)
								)}
							</div>
						</div>

						{!isMenuProduct && (
							<div>
								<AddToCartForm
									setTotalPrice={setTotalPrice}
									pizza={pizza}
								/>
							</div>
						)}

						<Separator />

						{handleEditPizza && handleDeletePizza && (
							<div className="flex justify-center items-center gap-2 px-4">
								<button
									onClick={() => handleEditPizza(pizza)}
									className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
									title="Edit Pizza"
								>
									<Edit className="w-4 h-4 sm:w-5 sm:h-5" />
								</button>

								<AlertDialog>
									<AlertDialogTrigger className="p-2 rounded-lg hover:bg-destructive transition-colors duration-200">
										<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-popover border-2 py-6 px-8">
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure, you
												want to delete🚫 this pizza ?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												your pizza and remove it's data
												from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground hover:text-black 60">
												<span>Cancel</span>
											</AlertDialogCancel>
											<AlertDialogAction
												className="bg-destructive text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-destructive/60"
												onClick={() =>
													handleDeletePizza(pizza._id)
												}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						)}
					</div>
				</div>

				<button
					onClick={handleClosePizza}
					className="fixed top-2 right-2 sm:top-5 sm:right-5 p-2 rounded-lg transition-colors hover:bg-muted duration-200"
				>
					<X className="w-4 h-4 sm:w-5 sm:h-5" />
				</button>
			</motion.div>
		</>
	);
};

export default ProductPreview;
