import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useIngredientStore } from "@/store/useIngredientStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Trash2 } from "lucide-react";
import Ingredients from "@/components/dashboard/Ingredients";
import { useWindowSize } from "@/hooks/useWindowSize";

const IngredientsPage = () => {
	const windowSize = useWindowSize();

	const ingredients = useIngredientStore((state) => state.ingredients);
	const base = useIngredientStore((state) => state.base);
	const sauce = useIngredientStore((state) => state.sauce);
	const cheese = useIngredientStore((state) => state.cheese);
	const veggie = useIngredientStore((state) => state.veggie);
	const extra = useIngredientStore((state) => state.extra);

	const [isMobile, setIsMobile] = useState(false);
	const [activeTab, setActiveTab] = useState("all");
	const [showEditForm, setShowEditForm] = useState(false);

	const getAllIngredients = useIngredientStore(
		(state) => state.getAllIngredients
	);
	const isLoadingIngredients = useIngredientStore((state) => state.isLoading);

	useEffect(() => {
		setIsMobile(windowSize.width < 640);
	}, [windowSize]);

	useEffect(() => {
		getAllIngredients();
	}, [getAllIngredients]);

	const getIngredients = () => {
		switch (activeTab) {
			case "all":
				return ingredients;

			case "base":
				return base;

			case "sauce":
				return sauce;

			case "cheese":
				return cheese;

			case "veggie":
				return veggie;

			case "extra":
				return extra;

			case "deleted":
				return ingredients;

			default:
				return ingredients;
		}
	};

	return (
		<section className="min-h-screen bg-section-background relative py-6 px-6 sm:px-12">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							className={`${activeTab === "all" ? "text-foreground" : ""}`}
							asChild
						>
							<Link to="/dashboard/orders">Ingredients</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />

					{activeTab !== "all" && (
						<>
							<BreadcrumbItem>
								<BreadcrumbLink className="text-foreground capitalize" asChild>
									<Link to="/dashboard/orders">{activeTab}</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
				<div className="w-full flex max-sm:flex-col justify-between items-start sm:items-center gap-4">
					<TabsList>
						<TabsTrigger value="all">
							{isMobile ? "All" : "All Ingredients"}
						</TabsTrigger>
						<TabsTrigger value="base">Base</TabsTrigger>
						<TabsTrigger value="sauce">Sauce</TabsTrigger>
						<TabsTrigger value="cheese">Cheese</TabsTrigger>
						<TabsTrigger value="veggie">Veggie</TabsTrigger>
						<TabsTrigger value="extra">Extra</TabsTrigger>
						<TabsTrigger value="deleted">
							<Trash2 className="size-3 md:size-4" />
						</TabsTrigger>
					</TabsList>

					<button className="btn-primary" onClick={() => setShowEditForm(true)}>
						Create Ingredient
					</button>
				</div>

				{isLoadingIngredients ? (
					<Loader className="w-6 h-6 animate-spin mx-auto my-52" />
				) : (
					<>
						<TabsContent value={activeTab} className="relative">
							<Ingredients
								ingredients={getIngredients()}
								deletedList={activeTab === "deleted"}
								showEditForm={showEditForm}
								setShowEditForm={setShowEditForm}
							/>
						</TabsContent>
					</>
				)}
			</Tabs>
		</section>
	);
};

export default IngredientsPage;
