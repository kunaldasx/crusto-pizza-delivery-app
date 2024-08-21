import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Asterisk, Loader, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { IngredientCategory, IngredientType } from "@/types/IngredientState";
import {
	IngredientFormType,
	ingredientSchema,
} from "@/schemas/ingredient.schema";
import { useIngredientStore } from "@/store/useIngredientStore";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const IngredientForm = ({
	ingredient,
	editMode = false,
	setEditIngredient,
	setEditMode,
	setShowEditForm,
}: {
	ingredient?: IngredientType;
	editMode?: boolean;
	setEditIngredient: React.Dispatch<
		React.SetStateAction<IngredientType | undefined>
	>;
	setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
	setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const createIngredient = useIngredientStore(
		(state) => state.createIngredient
	);
	const updateIngredient = useIngredientStore(
		(state) => state.updateIngredient
	);

	const form = useForm<IngredientFormType>({
		resolver: zodResolver(ingredientSchema),
		defaultValues: {
			name: ingredient?.name,
			type: ingredient?.type,
			image: undefined,
			price: ingredient?.price,
			stock: ingredient?.stock,
		},
	});

	const [previewImage, setPreviewImage] = useState(ingredient?.image);
	const [deletedImage, setDeletedImage] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (data: IngredientFormType) => {
		setIsSubmitting(true);
		setEditIngredient(undefined);
		setEditMode(false);
		setShowEditForm(false);
		try {
			let hasChanges = false;
			const formData = new FormData();

			if (deletedImage && ingredient?.image) {
				formData.append("deletedImage", ingredient.image);
				hasChanges = true;
			}

			if (data.image?.[0]) {
				formData.append("image", data.image[0]);
				hasChanges = true;
			}

			if (data.name !== ingredient?.name) {
				formData.append("name", data.name);
				hasChanges = true;
			}

			if (data.type !== ingredient?.type) {
				formData.append("type", data.type);
				hasChanges = true;
			}

			if (data.price !== ingredient?.price) {
				formData.append("price", data.price.toString());
				hasChanges = true;
			}
			if (data.stock !== ingredient?.stock) {
				formData.append("stock", data.stock.toString());
				hasChanges = true;
			}

			// Nothing to update
			if (!hasChanges) {
				console.log("Nothing updated");
				return;
			}

			let response;
			if (editMode && ingredient) {
				response = await updateIngredient(
					ingredient._id,
					ingredient.type,
					formData
				);
			} else {
				response = await createIngredient(formData);
			}

			response.success
				? toast.success(response.message)
				: toast.error(response.message);
		} catch (error) {
			console.log("Error updating profile: ", (error as Error).message);
			toast.error("Error updating profile");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Form validation errors
	const onError = (errors: any) => {
		console.log("Form errors:", errors);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageURL = URL.createObjectURL(file);
			setPreviewImage(imageURL);
			setDeletedImage(true);
		}
	};

	const handleRemoveImage = () => {
		setPreviewImage("");
		setDeletedImage(true);
	};

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
				onClick={() => {
					setEditIngredient(undefined);
					setEditMode(false);
					setShowEditForm(false);
				}}
			/>

			{/* Popover Content */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				transition={{ duration: 0.3 }}
				className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[40%] max-h-[90%] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border-2 rounded-lg shadow-xl z-70 overflow-y-auto"
			>
				<div className="w-full flex flex-col justify-start items-center gap-8 py-6 px-8">
					<h4 className="text-xl font-semibold text-heading tracking-wider border-2 p-2 rounded-lg">
						{editMode ? "Edit Ingredient" : "Create Ingredient"}
					</h4>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="w-full space-y-6"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Name
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Enter ingredient name"
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm">
											Type
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Select
												key={`status-select-${field.value}`}
												onValueChange={field.onChange}
												value={field.value}
												disabled={editMode || isSubmitting}
											>
												<SelectTrigger className="w-full px-6 border-2 border-border">
													<SelectValue placeholder="Select ingredient type" />
												</SelectTrigger>
												<SelectContent className="z-150">
													<SelectGroup>
														<SelectLabel>Type</SelectLabel>
														<SelectItem value={IngredientCategory.Base}>
															Base
														</SelectItem>
														<SelectItem value={IngredientCategory.Sauce}>
															Sauce
														</SelectItem>
														<SelectItem value={IngredientCategory.Cheese}>
															Cheese
														</SelectItem>
														<SelectItem value={IngredientCategory.Veggie}>
															Veggie
														</SelectItem>
														<SelectItem value={IngredientCategory.Extra}>
															Extra
														</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="w-fit flex flex-col gap-2">
								<p className="text-sm flex space-x-2">
									<span>Image</span>
									<Asterisk className="size-3 stroke-destructive" />
								</p>
								<div className="bg-input flex justify-center items-center gap-4 border-2 border-input-border rounded-lg p-2">
									{previewImage ? (
										<div className="sm:w-[150px] h-[150px] bg-popover flex justify-center items-center border-2 border-input-border rounded-lg overflow-hidden relative">
											<img
												src={previewImage}
												className="w-full h-full object-cover"
												alt="pizza image"
											/>

											<button
												type="button"
												className="bg-popover absolute top-0 right-0 group"
												onClick={handleRemoveImage}
											>
												<X className="group-hover:stroke-accent" />
											</button>
										</div>
									) : (
										<FormField
											control={form.control}
											name="image"
											render={({ field: { onChange, ref } }) => (
												<FormItem>
													<FormLabel className="w-[150px] h-[150px] bg-popover flex justify-center items-center border-2 border-input-border rounded-lg hover:bg-input/70 transition-colors duration-300 cursor-pointer">
														<Plus className="size-7" />
													</FormLabel>
													<FormControl>
														<Input
															type="file"
															accept="image/*"
															className="hidden"
															ref={ref}
															onChange={(event) => {
																handleImageChange(event);
																onChange(event.target.files);
															}}
															disabled={isSubmitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</div>
							</div>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Price
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												disabled={isSubmitting}
												placeholder="Enter ingredient price"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Stock
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												disabled={isSubmitting}
												placeholder="Enter ingredient stock"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-start items-center gap-2">
								<button type="submit" className="btn-primary">
									{isSubmitting ? (
										<Loader className="w-6 h-6 animate-spin" />
									) : editMode ? (
										"Update"
									) : (
										"Create"
									)}
								</button>
								<button
									type="button"
									className="btn-secondary"
									onClick={() => {
										setEditIngredient(undefined);
										setEditMode(false);
										setShowEditForm(false);
										form.reset();
										setPreviewImage("");
									}}
								>
									<span>Cancel</span>
								</button>
							</div>
						</form>
					</Form>
				</div>
				<button
					onClick={() => {
						setEditIngredient(undefined);
						setEditMode(false);
						setShowEditForm(false);
					}}
					className="fixed top-2 right-2 sm:top-5 sm:right-5 p-2 rounded-lg transition-colors hover:bg-muted duration-200"
				>
					<X className="w-4 h-4 sm:w-5 sm:h-5" />
				</button>
			</motion.div>
		</>
	);
};

export default IngredientForm;
