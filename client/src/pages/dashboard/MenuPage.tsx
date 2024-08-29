import { motion, AnimatePresence } from "motion/react";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Loader, X } from "lucide-react";
import { PizzaType } from "@/types/PizzaState";
import ProductPreview from "@/components/ProductPreview";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePizzaStore } from "@/store/usePizzaStore";
import PizzaForm from "@/components/forms/PizzaForm";

const Menu = () => {
	const pizzas = usePizzaStore((state) => state.pizzas);
	const getAllPizzas = usePizzaStore((state) => state.getAllPizzas);
	const isLoadingPizzas = usePizzaStore((state) => state.isLoading);
	const deletePizza = usePizzaStore((state) => state.deletePizza);

	const [editMode, setEditMode] = useState(false); // Open and close form [Create & Edit]
	const [editingPizza, setEditingPizza] = useState<PizzaType>(); // Initialize form [Edit]
	const [viewingPizza, setViewingPizza] = useState<PizzaType>(); // Pizza in view

	useEffect(() => {
		if (!isLoadingPizzas) {
			getAllPizzas();
		}
	}, [getAllPizzas]);

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
		const response = await deletePizza(pizzaId);

		if (response.success) {
			toast.success(response.message);
			setViewingPizza(undefined);
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

	return (
		<section className="min-h-screen bg-section-background relative py-6 px-6 md:px-12">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink className="text-foreground" asChild>
							<Link to="/dashboard/menu">Menu</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
				</BreadcrumbList>
			</Breadcrumb>

			{!editMode ? (
				<div className="w-full flex justify-between items-center">
					<p className="text-sm tracking-wide font-medium bg-primary-end px-4 py-1 rounded-md">
						Menu
					</p>
					<button className="btn-primary" onClick={handleCreatePizza}>
						Create a Pizza
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
				<div className="w-full bg-popover flex justify-center items-center border-2 px-4 rounded-xl mt-6 md:mt-12">
					{!isLoadingPizzas && pizzas.length ? (
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
							{[...pizzas].reverse().map((pizza) => (
								<li key={pizza._id} className="animated-card">
									<ProductCard
										key={pizza._id}
										pizza={pizza}
										onView={() => handleViewPizza(pizza)}
										isMenuProduct={true}
									/>
								</li>
							))}
						</motion.ul>
					) : (
						<p className="text text-center my-52">
							{isLoadingPizzas ? (
								<Loader className="w-6 h-6 animate-spin mx-auto" />
							) : (
								"No pizzas to show"
							)}
						</p>
					)}
				</div>
			) : (
				<PizzaForm
					handleCloseForm={handleCloseForm}
					pizza={editingPizza}
				/>
			)}

			{/* Pizza Details Popover */}
			<AnimatePresence>
				{viewingPizza && (
					<ProductPreview
						pizza={viewingPizza}
						isMenuProduct={true}
						handleClosePizza={handleClosePizza}
						handleEditPizza={handleEditPizza}
						handleDeletePizza={handleDeletePizza}
					/>
				)}
			</AnimatePresence>
		</section>
	);
};

export default Menu;
