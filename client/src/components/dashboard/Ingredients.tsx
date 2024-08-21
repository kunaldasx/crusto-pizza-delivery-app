import { IngredientCategory, IngredientType } from "@/types/IngredientState";
import { Badge } from "../ui/badge";
import IngredientQuickForm from "../forms/IngredientQuickForm";
import { ArchiveRestore, Edit, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useIngredientStore } from "@/store/useIngredientStore";
import { toast } from "sonner";
import { useState } from "react";
import IngredientForm from "../forms/IngredientForm";
import { cn } from "@/lib/utils";

const Ingredients = ({
	ingredients,
	deletedList = false,
	showEditForm,
	setShowEditForm,
}: {
	ingredients?: IngredientType[];
	deletedList: boolean;
	showEditForm: boolean;
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const deleteIngredient = useIngredientStore(
		(state) => state.deleteIngredient
	);
	const restoreIngredient = useIngredientStore(
		(state) => state.restoreIngredient
	);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editIngredient, setEditIngredient] = useState<IngredientType>();

	// Filter ingredients based on the deletedList condition before rendering
	const filteredIngredients =
		ingredients?.filter((item) => deletedList === item.isDeleted) || [];

	const handleRemoveIngredient = async (
		id: string,
		type: IngredientCategory
	) => {
		try {
			setIsSubmitting(true);
			const response = await deleteIngredient(id, type);

			response.success
				? toast.success(response.message)
				: toast.error(response.message);
		} catch (error) {
			toast.error("Failed to delete ingredient");
			console.log("[Delete ingredient] ", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRestoreIngredient = async (
		id: string,
		type: IngredientCategory
	) => {
		try {
			setIsSubmitting(true);
			const response = await restoreIngredient(id, type);

			response.success
				? toast.success(response.message)
				: toast.error(response.message);
		} catch (error) {
			toast.error("Failed to restore ingredient");
			console.log("[Restore ingredient] ", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			{filteredIngredients.length ? (
				<div className="w-full bg-popover grid grid-cols-1 lg:grid-cols-2 gap-4 border-2 rounded-xl p-4 md:p-6 mt-6 md:mt-12">
					{[...filteredIngredients].reverse().map((item) => (
						<div
							key={item._id}
							className={cn(
								"w-full bg-card flex max-sm:flex-col justify-start items-start rounded-lg p-4",
								!item.isAvailable ? "opacity-60" : ""
							)}
						>
							<div className="flex-1 flex justify-start items-start gap-4">
								<img
									src={item.image}
									alt="Ingredient image"
									className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] object-cover rounded-lg"
								/>

								<div className="flex-1 flex flex-col justify-start items-start gap-2">
									<h2 className="text-heading text-2xl font-semibold tracking-wide">
										{item.name}
									</h2>
									<Badge className="capitalize">{item.type}</Badge>

									{/* Stock and Price update form */}
									<IngredientQuickForm
										ingredientId={item._id}
										ingredientType={item.type}
										initialPrice={item.price}
										initialStock={item.stock}
									/>
								</div>
							</div>
							<div className="flex justify-center items-center gap-2">
								{deletedList ? (
									<button
										className="group"
										disabled={isSubmitting}
										onClick={() => handleRestoreIngredient(item._id, item.type)}
									>
										<ArchiveRestore className="size-4 md:size-5 group-hover:stroke-accent" />
									</button>
								) : (
									<>
										{/* Edit button */}
										<button
											className="group"
											onClick={() => {
												setEditIngredient(item);
												setEditMode(true);
												setShowEditForm(true);
											}}
										>
											<Edit className="size-4 md:size-5 group-hover:stroke-accent" />
										</button>

										{/* Remove button */}
										<AlertDialog>
											<AlertDialogTrigger
												className="group"
												disabled={isSubmitting}
											>
												<Trash2 className="size-4 md:size-5 group-hover:stroke-accent" />
											</AlertDialogTrigger>
											<AlertDialogContent className="bg-popover border-2 py-6 px-8">
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure, you want to delete🚫 this
														item ?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently
														delete the ingredient and remove it's data from our
														servers.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground hover:text-black 60">
														<span>Cancel</span>
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleRemoveIngredient(item._id, item.type)
														}
														disabled={isSubmitting}
														className="bg-destructive text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-destructive/60"
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text my-52">No ingredients found</p>
			)}

			{showEditForm && (
				<IngredientForm
					ingredient={editIngredient}
					editMode={editMode}
					setEditIngredient={setEditIngredient}
					setEditMode={setEditMode}
					setShowEditForm={setShowEditForm}
				/>
			)}
		</>
	);
};

export default Ingredients;
