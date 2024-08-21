import { PizzaType } from "@/types/PizzaState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Asterisk, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useIngredientStore } from "@/store/useIngredientStore";
import { cn } from "@/lib/utils";
import { useCustomPizzaStore } from "@/store/useCustomPizzaStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
	CustomPizzaFormType,
	customPizzaSchema,
} from "@/schemas/customPizza.schema";
import {
	createFormData,
	getChangedFields,
	initializeImageStates,
} from "@/lib/customPizzaUtils";
import { ImageState } from "@/types/CustomPizzaState";

const CustomPizzaForm = ({
	pizza,
	handleCloseForm,
}: {
	pizza?: PizzaType;
	handleCloseForm: () => void;
}) => {
	const [imageStates, setImageStates] = useState<ImageState[]>(
		initializeImageStates(pizza?.images)
	);
	const [maxCap, setMaxCap] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Store original values for comparison during updates
	const [originalValues, setOriginalValues] =
		useState<CustomPizzaFormType | null>(null);

	// Ingredients
	const getAllIngredients = useIngredientStore(
		(state) => state.getAllIngredients
	);

	const baseOptions = useIngredientStore((state) => state.base);
	const sauceOptions = useIngredientStore((state) => state.sauce);
	const cheeseOptions = useIngredientStore((state) => state.cheese);
	const veggieOptions = useIngredientStore((state) => state.veggie);
	const extraOptions = useIngredientStore((state) => state.extra);

	const createCustomPizza = useCustomPizzaStore(
		(state) => state.createCustomPizza
	);
	const updateCustomPizza = useCustomPizzaStore(
		(state) => state.updateCustomPizza
	);
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const cheeseIds = pizza?.cheese?.map((item) => item._id);
	const veggieIds = pizza?.veggie?.map((item) => item._id);
	const extraIds = pizza?.extra?.map((item) => item._id);

	const defaultValues = {
		name: pizza?.name ?? "",
		description: pizza?.description ?? "",

		// Ingredients
		base: pizza?.base._id ?? "",
		sauce: pizza?.sauce._id ?? "",
		cheese: cheeseIds ?? [],
		veggie: veggieIds ?? [],
		extra: extraIds ?? [],
	};

	const form = useForm<CustomPizzaFormType>({
		resolver: zodResolver(customPizzaSchema),
		defaultValues,
	});

	useEffect(() => {
		getAllIngredients();
	}, [getAllIngredients]);

	// Store original values for update comparison
	useEffect(() => {
		if (pizza) {
			setOriginalValues(defaultValues);
		}
	}, [pizza]);

	// Check if max capacity is reached
	useEffect(() => {
		const activeImages = imageStates.filter(
			(state) => state.status !== "deleted"
		);
		setMaxCap(activeImages.length >= 5);
	}, [imageStates]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const activeImages = imageStates.filter(
			(state) => state.status !== "deleted"
		);
		const remainingSlots = 5 - activeImages.length;
		const fileArray = Array.from(files).slice(0, remainingSlots);

		const newImageStates: ImageState[] = fileArray.map((file, index) => ({
			id: `new-${Date.now()}-${index}`,
			url: URL.createObjectURL(file),
			file,
			status: "new",
		}));

		setImageStates((prev) => [...prev, ...newImageStates]);
	};

	const handleRemoveImage = (imageId: string) => {
		setImageStates(
			(prev) =>
				prev
					.map((imageState) => {
						if (imageState.id === imageId) {
							// Revoke blob URL if it's a new image
							if (
								imageState.status === "new" &&
								imageState.url.startsWith("blob:")
							) {
								URL.revokeObjectURL(imageState.url);
							}

							// Mark as deleted instead of removing (for existing images)
							// For new images, we can actually remove them
							if (imageState.status === "new") {
								return null; // Will be filtered out
							} else {
								return { ...imageState, status: "deleted" as const };
							}
						}
						return imageState;
					})
					.filter(Boolean) as ImageState[]
		);
	};

	// Check if there are image changes
	const hasImageChanges = useMemo(() => {
		// Check if there are any new images
		const hasNewImages = imageStates.some((state) => state.status === "new");

		// Check if any existing images were deleted
		const hasDeletedImages = imageStates.some(
			(state) => state.status === "deleted"
		);

		return hasNewImages || hasDeletedImages;
	}, [imageStates]);

	const onSubmit = async (data: CustomPizzaFormType) => {
		setIsSubmitting(true);

		try {
			const isUpdate = !!pizza;
			const userId = isAuthenticated ? user?._id || null : null;

			let response;

			const ingredients = {
				base: baseOptions,
				sauce: sauceOptions,
				cheese: cheeseOptions,
				veggie: veggieOptions,
				extra: extraOptions,
			};

			if (isUpdate && originalValues) {
				// For updates, only send changed fields
				const changedFields = getChangedFields(data, originalValues);

				// Only proceed if there are actual changes or image changes
				if (Object.keys(changedFields).length === 0 && !hasImageChanges) {
					toast.info("No changes detected");
					return;
				}

				const formData = createFormData(changedFields, imageStates);

				response = await updateCustomPizza(
					pizza._id,
					formData,
					ingredients,
					userId
				);
			} else {
				// For creation, send all data
				const formData = createFormData(data, imageStates);

				response = await createCustomPizza(formData, ingredients, userId);
			}

			if (response.success) {
				toast.success(response.message);

				form.reset();
				// Clean up blob URLs
				imageStates.forEach((state) => {
					if (state.url.startsWith("blob:")) {
						URL.revokeObjectURL(state.url);
					}
				});
				setImageStates([]);
				setMaxCap(false);
				handleCloseForm();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			console.error("Submit error:", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Cleanup blob URLs on unmount
	useEffect(() => {
		return () => {
			imageStates.forEach((state) => {
				if (state.url.startsWith("blob:")) {
					URL.revokeObjectURL(state.url);
				}
			});
		};
	}, []);

	// Form validation errors
	const onError = (errors: any) => {
		console.log("Form errors:", errors);
	};

	return (
		<div className="w-full py-10">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full flex flex-col justify-start gap-10"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md">
									Name
									<Asterisk className="size-3 stroke-destructive" />
								</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Enter a name" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md">Description</FormLabel>
								<FormControl>
									<Textarea {...field} placeholder="Enter a description" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isAuthenticated && (
						<div className="flex flex-col gap-2">
							<p className="text-md">Images</p>
							<div className="w-full bg-input grid grid-cols-3 sm:flex sm:justify-start sm:items-center gap-4 sm:flex-wrap border-2 border-input-border rounded-lg p-4">
								{imageStates &&
									imageStates.map(
										(imageState: ImageState) =>
											imageState.status !== "deleted" && (
												<div
													key={imageState.id}
													className="sm:w-[150px] h-[150px] bg-popover flex justify-center items-center border-2 border-input-border rounded-lg overflow-hidden relative"
												>
													<img
														src={imageState.url}
														className="w-full h-full object-cover"
														alt="pizza image"
													/>

													<button
														type="button"
														className="bg-popover absolute top-0 right-0 group"
														onClick={() => handleRemoveImage(imageState.id)}
													>
														<X className="group-hover:stroke-accent" />
													</button>
												</div>
											)
									)}
								{!maxCap && (
									<label
										htmlFor="image-upload"
										className="w-[150px] h-[150px] bg-popover flex justify-center items-center border-2 border-input-border rounded-lg hover:bg-input/70 transition-colors duration-300 cursor-pointer"
									>
										<Plus className="size-7" />
										<Input
											id="image-upload"
											type="file"
											accept="image/*"
											multiple
											disabled={!isAuthenticated}
											className="hidden"
											onChange={handleImageChange} // Only your logic matters
										/>
									</label>
								)}
							</div>
						</div>
					)}

					{/* BASE */}
					<FormField
						control={form.control}
						name="base"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md">
									Base
									<Asterisk className="size-3 stroke-destructive" />
								</FormLabel>
								<FormControl>
									<div className="bg-input grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-input-border">
										{baseOptions.map((item) => {
											const selected = field.value === item._id;
											const unavailable = !item.isAvailable || item.isDeleted;

											return (
												<label
													key={item._id}
													className={cn(
														"bg-popover cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm",
														unavailable
															? "opacity-50 cursor-not-allowed"
															: selected
															? "ring-2 ring-ring bg-white/25"
															: "border-muted hover:ring-1 hover:ring-primary/50"
													)}
													onClick={() => {
														{
															!unavailable && field.onChange(item._id);
														}
													}}
												>
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-[150px] object-cover rounded-lg"
													/>
													<span className="text-sm text-center font-semibold">
														{item.name}
													</span>
												</label>
											);
										})}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* SAUCE  */}
					<FormField
						control={form.control}
						name="sauce"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-md">
									Sauce
									<Asterisk className="size-3 stroke-destructive" />
								</FormLabel>
								<FormControl>
									<div className="bg-input grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-input-border">
										{sauceOptions.map((item) => {
											const selected = field.value === item._id;
											const unavailable = !item.isAvailable || item.isDeleted;

											return (
												<label
													key={item._id}
													className={cn(
														"bg-popover cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm",
														unavailable
															? "opacity-50 cursor-not-allowed"
															: selected
															? "ring-2 ring-ring bg-white/25"
															: "border-muted hover:ring-1 hover:ring-primary/50"
													)}
													onClick={() => {
														{
															!unavailable && field.onChange(item._id);
														}
													}}
												>
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-[150px] object-cover rounded-lg"
													/>
													<span className="text-sm text-center font-semibold">
														{item.name}
													</span>
												</label>
											);
										})}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* CHEESE */}
					<FormField
						control={form.control}
						name="cheese"
						render={() => (
							<FormItem>
								<FormLabel className="text-md">Cheese</FormLabel>
								<div className="bg-input grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-input-border">
									{cheeseOptions.map((item) => (
										<FormField
											key={item._id}
											control={form.control}
											name="cheese"
											render={({ field }) => {
												const selected = field.value?.includes(item._id);
												const unavailable = !item.isAvailable || item.isDeleted;

												return (
													<label
														className={cn(
															"bg-popover cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm",
															unavailable
																? "opacity-50 cursor-not-allowed"
																: selected
																? "ring-2 ring-ring bg-white/25"
																: "border-muted hover:ring-1 hover:ring-primary/50"
														)}
														onClick={() => {
															if (unavailable) return;

															const updated = selected
																? field.value?.filter((id) => id !== item._id)
																: [...(field.value ?? []), item._id];
															field.onChange(updated);
														}}
													>
														<img
															src={item.image}
															alt={item.name}
															className="w-full h-[150px] object-cover rounded-lg"
														/>
														<span className="text-sm text-center font-semibold">
															{item.name}
														</span>
													</label>
												);
											}}
										/>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* VEGGIE */}
					<FormField
						control={form.control}
						name="veggie"
						render={() => (
							<FormItem>
								<FormLabel className="text-md">Veggie</FormLabel>
								<div className="bg-input grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-input-border">
									{veggieOptions.map((item) => (
										<FormField
											key={item._id}
											control={form.control}
											name="veggie"
											render={({ field }) => {
												const selected = field.value?.includes(item._id);
												const unavailable = !item.isAvailable || item.isDeleted;

												return (
													<label
														className={cn(
															"bg-popover cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm",
															unavailable
																? "opacity-50 cursor-not-allowed"
																: selected
																? "ring-2 ring-ring bg-white/25"
																: "border-muted hover:ring-1 hover:ring-primary/50"
														)}
														onClick={() => {
															if (unavailable) return;

															const updated = selected
																? field.value?.filter((id) => id !== item._id)
																: [...(field.value ?? []), item._id];
															field.onChange(updated);
														}}
													>
														<img
															src={item.image}
															alt={item.name}
															className="w-full h-[150px] object-cover rounded-lg"
														/>
														<span className="text-sm text-center font-semibold">
															{item.name}
														</span>
													</label>
												);
											}}
										/>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* EXTRA */}
					<FormField
						control={form.control}
						name="extra"
						render={() => (
							<FormItem>
								<FormLabel className="text-md">Extra</FormLabel>
								<div className="bg-input grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-input-border">
									{extraOptions.map((item) => (
										<FormField
											key={item._id}
											control={form.control}
											name="extra"
											render={({ field }) => {
												const selected = field.value?.includes(item._id);
												const unavailable = !item.isAvailable || item.isDeleted;

												return (
													<label
														className={cn(
															"bg-popover cursor-pointer rounded-lg border p-2 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm",
															unavailable
																? "opacity-50 cursor-not-allowed"
																: selected
																? "ring-2 ring-ring bg-white/25"
																: "border-muted hover:ring-1 hover:ring-primary/50"
														)}
														onClick={() => {
															if (unavailable) return;

															const updated = selected
																? field.value?.filter((id) => id !== item._id)
																: [...(field.value ?? []), item._id];
															field.onChange(updated);
														}}
													>
														<img
															src={item.image}
															alt={item.name}
															className="w-full h-[150px] object-cover rounded-lg"
														/>
														<span className="text-sm text-center font-semibold">
															{item.name}
														</span>
													</label>
												);
											}}
										/>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex gap-4 justify-center sm:justify-start mt-6">
						<button
							type="submit"
							disabled={isSubmitting}
							className="btn-primary"
						>
							{isSubmitting
								? pizza
									? "Updating..."
									: "Creating..."
								: pizza
								? "Update Pizza"
								: "Create Pizza"}
						</button>
						<button className="btn-secondary" onClick={() => handleCloseForm()}>
							<span>Cancel</span>
						</button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CustomPizzaForm;
