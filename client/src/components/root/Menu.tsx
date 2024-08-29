import StarDivider from "../widgets/StarDivider";
import ProductCard from "../ProductCard";
import { AnimatePresence, motion } from "motion/react";
import { usePizzaStore } from "@/store/usePizzaStore";
import { PizzaType } from "@/types/PizzaState";
import { useState } from "react";
import ProductPreview from "../ProductPreview";
import { Loader } from "lucide-react";

const rating = [
	{
		star: 4,
		review: 105,
	},
	{
		star: 3.5,
		review: 57,
	},
	{
		star: 2.5,
		review: 305,
	},
	{
		star: 5,
		review: 50,
	},
	{
		star: 4.5,
		review: 156,
	},
];

const Menu = () => {
	const pizzas = usePizzaStore((state) => state.pizzas);
	const isLoadingPizzas = usePizzaStore((state) => state.isLoading);

	const [viewingPizza, setViewingPizza] = useState<PizzaType>(); // Pizza in view

	const handleViewPizza = (pizza: PizzaType) => {
		setViewingPizza(pizza);
	};

	const handleClosePizza = () => {
		setViewingPizza(undefined);
	};

	const containerVariants = {
		animate: {
			transition: {
				staggerChildren: 0.2, // delay between children
			},
		},
	};

	const childVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
	};

	return (
		<section
			id="menu"
			className="w-full bg-section-background flex justify-center items-center relative overflow-hidden"
		>
			<motion.div
				variants={containerVariants}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="container w-full flex flex-col justify-center items-center gap-6 md:gap-12 mx-14 my-8 md:my-20"
			>
				<div className="w-[320px] md:w-[625px] flex flex-col justify-center items-center gap-2 md:gap-4">
					<motion.div
						className="flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">Choose your favour</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						The Best Pizza Menu in Town
					</motion.h2>
				</div>

				<motion.ul
					variants={childVariants}
					className="w-full gap-4 md:gap-6 py-4 justify-start px-auto"
					style={{
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fill, minmax(280px, 1fr))",
					}}
				>
					{!isLoadingPizzas && pizzas.length ? (
						[...pizzas].reverse().map((pizza, idx) => (
							<li key={pizza._id} className="animated-card">
								<ProductCard
									key={pizza._id}
									pizza={pizza}
									rating={rating[idx % rating.length]}
									onView={() => handleViewPizza(pizza)}
								/>
							</li>
						))
					) : (
						<div className="col-span-4 justify-center items-center my-52">
							{isLoadingPizzas ? (
								<Loader className="w-6 h-6 animate-spin mx-auto" />
							) : (
								<p className="text text-center">
									No pizzas to show
								</p>
							)}
						</div>
					)}
				</motion.ul>
			</motion.div>

			{/* Pizza Details Popover */}
			<AnimatePresence>
				{viewingPizza && (
					<ProductPreview
						pizza={viewingPizza}
						handleClosePizza={handleClosePizza}
					/>
				)}
			</AnimatePresence>
		</section>
	);
};

export default Menu;
