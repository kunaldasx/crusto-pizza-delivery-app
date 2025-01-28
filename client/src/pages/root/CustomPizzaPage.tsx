import { motion, AnimatePresence } from "motion/react";
import { useCustomPizzaStore } from "@/store/useCustomPizzaStore";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import CustomPizzaForm from "@/components/forms/CustomPizzaForm";
import { Loader, X } from "lucide-react";
import { PizzaType } from "@/types/PizzaState";
import ProductPreview from "@/components/ProductPreview";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";

const CustomPizzaPage = () => {
	const [searchParams] = useSearchParams();

	const user = useAuthStore((state) => state.user);

	const customPizzas = useCustomPizzaStore((state) => state.customPizzas);
	const isLoadingCustomPizzas = useCustomPizzaStore(
		(state) => state.isLoading
	);
	const deleteCustomPizza = useCustomPizzaStore(
		(state) => state.deleteCustomPizza
	);

	const [editMode, setEditMode] = useState(false); // Open and close form [Create & Edit]
	const [editingPizza, setEditingPizza] = useState<PizzaType>(); // Initialize form [Edit]
	const [viewingPizza, setViewingPizza] = useState<PizzaType>(); // Pizza in view

	const handleCreatePizza = () => {
		setEditingPizza(undefined);
		setEditMode(true);
	};

	const handleEditPizza = (pizza: PizzaType) => {
		setEditingPizza(pizza);
		setEditMode(true);
		setViewingPizza(undefined); // Close details if open
	};

	const handleDeletePizza = async (pizzaId: string) => {
		setViewingPizza(undefined);
		const response = await deleteCustomPizza(pizzaId, user?._id ?? null);

		if (response.success) {
			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	};

	const handleCloseForm = () => {
		setEditMode(false);
		setEditingPizza(undefined);
	};

	const handleViewPizza = (pizza: PizzaType) => {
		setViewingPizza(pizza);
		setEditMode(false); // Close form if open
	};

	const handleClosePizza = () => {
		setViewingPizza(undefined);
	};

	const isUpdating = editingPizza !== undefined;

	// Initially open the create form
	useEffect(() => {
		const isNew = searchParams.get("new");
		if (isNew === "true") {
			handleCreatePizza();
		}
	}, [searchParams]);

	return (
		<section className="w-screen relative min-h-screen pt-20 sm:pt-30 md:pt-40 pb-20 px-4 md:px-20">
			{!editMode ? (
				<div className="w-full flex justify-between items-center">
					<h2 className="heading-2 mb-4">My Pizzas</h2>
					<button
						className="btn-primary mb-4"
						onClick={handleCreatePizza}
					>
						Create a Custom Pizza
					</button>
				</div>
			) : (
				<div className="w-full flex justify-between items-center">
					<h2 className="heading-2 mb-4">
						{isUpdating ? "Update Pizza" : "Create Pizza"}
					</h2>
					<button
						className="p-2 rounded-lg hover:bg-popover hover:text-secondary-foreground hover:border-2"
						onClick={handleCloseForm}
					>
						<X />
					</button>
				</div>
			)}

			{!editMode ? (
				<div className="w-full bg-section-background flex justify-center items-center border-2 rounded-xl px-4">
					{!isLoadingCustomPizzas && customPizzas.length ? (
						<motion.ul
							initial={{ y: -30, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="w-full gap-4 md:gap-6 py-4 justify-start px-auto"
							style={{
								display: "grid",
								gridTemplateColumns:
									"repeat(auto-fill, minmax(280px, 1fr))",
							}}
						>
							{[...customPizzas].reverse().map((pizza) => (
								<li key={pizza._id} className="animated-card">
									<ProductCard
										key={pizza._id}
										pizza={pizza}
										onView={() => handleViewPizza(pizza)}
									/>
								</li>
							))}
						</motion.ul>
					) : (
						<p className="text text-center my-52">
							{isLoadingCustomPizzas ? (
								<Loader className="w-6 h-6 animate-spin mx-auto" />
							) : (
								"No pizzas to show"
							)}
						</p>
					)}
				</div>
			) : (
				<CustomPizzaForm
					handleCloseForm={handleCloseForm}
					pizza={editingPizza}
				/>
			)}

			{/* Pizza Details Popover */}
			<AnimatePresence>
				{viewingPizza && (
					<ProductPreview
						pizza={viewingPizza}
						handleClosePizza={handleClosePizza}
						handleEditPizza={handleEditPizza}
						handleDeletePizza={handleDeletePizza}
					/>
				)}
			</AnimatePresence>

			{/* Floating Shapes */}
			<motion.div
				initial={{ y: 0 }}
				whileInView={{ y: ["10%", "-10%"] }}
				transition={{
					duration: 7,
					ease: "linear",
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="absolute bottom-0 left-0 -z-40"
			>
				<img
					src={shape1}
					className="w-28 md:w-40 lg:w-full"
					aria-hidden
				/>
			</motion.div>
			<motion.div
				initial={{ y: 0 }}
				whileInView={{ y: ["10%", "-10%"] }}
				transition={{
					duration: 7,
					ease: "linear",
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="absolute top-0 right-0 -z-40"
			>
				<img
					src={shape2}
					className="w-40 md:w-52 lg:w-full"
					aria-hidden
				/>
			</motion.div>
		</section>
	);
};

export default CustomPizzaPage;
