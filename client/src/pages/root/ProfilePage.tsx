import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Asterisk, Camera, Edit, Loader, Trash2, X } from "lucide-react";
import {
	AddressFormType,
	ProfileFormType,
	profileSchema,
} from "@/schemas/profile.schema";
import { getDefaultValuesFromUser } from "@/lib/profileUtils";
import AddressForm from "@/components/forms/AddressFrom";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";

const ProfilePage = () => {
	const user = useAuthStore((state) => state.user);
	const updateProfile = useAuthStore((state) => state.updateProfile);
	const isLoadingAuth = useAuthStore((state) => state.isLoading);

	const form = useForm<ProfileFormType>({
		resolver: zodResolver(profileSchema),
		defaultValues: getDefaultValuesFromUser(user),
	});

	const { fields, append, remove, update } = useFieldArray({
		control: form.control,
		name: "addresses",
	});

	const [showAddressForm, setShowAddressForm] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [previewImage, setPreviewImage] = useState(user?.profileImage || "");
	const [originalFormData, setOriginalFormData] = useState<ProfileFormType>(
		getDefaultValuesFromUser(user)
	);
	const [deletedProfileImage, setDeletedProfileImage] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (user) {
			const formData = getDefaultValuesFromUser(user);
			form.reset(formData);
			setOriginalFormData(formData);
			setPreviewImage(user.profileImage ?? "");
		}
	}, [user, form]);

	const handleSaveNewAddress = (addressData: AddressFormType) => {
		if (editIndex !== null) {
			// Update existing address
			update(editIndex, addressData);
			setEditIndex(null);
		} else {
			// Add new address
			append(addressData);
		}
		setShowAddressForm(false);
	};

	const handleCancelNewAddress = () => {
		setShowAddressForm(false);
		setEditIndex(null);
	};

	const handleEditAddress = (index: number) => {
		const addresses = form.getValues("addresses");
		if (!addresses || !addresses[index]) return;

		setEditIndex(index);
		setShowAddressForm(true);
	};

	const handleRemoveAddress = (index: number) => {
		const defaultAddressIndex = parseInt(
			form.getValues("defaultAddressIndex"),
			10
		);
		if (index === defaultAddressIndex) {
			const newIndex = index > 0 ? index - 1 : 0;
			form.setValue("defaultAddressIndex", newIndex.toString());
		}
		remove(index);
	};

	const onSubmit = async (data: ProfileFormType) => {
		setIsSubmitting(true);
		try {
			let hasChanges = false;
			const formData = new FormData();

			if (deletedProfileImage && user?.profileImage) {
				formData.append("deletedProfileImage", user.profileImage);
				hasChanges = true;
			}

			if (data.profileImage?.[0]) {
				formData.append("profileImage", data.profileImage[0]);
				hasChanges = true;
			}

			if (data.username !== user?.username) {
				formData.append("username", data.username);
				hasChanges = true;
			}

			if (data.email !== user?.email) {
				formData.append("email", data.email);
				hasChanges = true;
			}

			const defaultAddress =
				data.addresses?.[parseInt(data.defaultAddressIndex, 10)];

			// Strip _ids from addresses
			const userAddresses = user?.addresses?.map((address) => {
				const { phone, altPhone, ...rest } = address;

				return {
					...rest,
					phone: {
						countryCode: phone.countryCode,
						number: phone.number,
					},
					altPhone: altPhone?.number
						? {
								countryCode: altPhone.countryCode,
								number: altPhone.number,
						  }
						: undefined,
				};
			});

			// Strip _ids from defaultAddress
			let userDefaultAddress;
			if (user?.defaultAddress) {
				const { phone, altPhone, ...rest } = user.defaultAddress;

				userDefaultAddress = {
					...rest,
					phone: {
						countryCode: phone.countryCode,
						number: phone.number,
					},
					altPhone: altPhone?.number
						? {
								countryCode: altPhone.countryCode,
								number: altPhone.number,
						  }
						: undefined,
				};
			}

			if (
				JSON.stringify(data.addresses ?? []) !==
					JSON.stringify(userAddresses ?? []) ||
				JSON.stringify(defaultAddress) !==
					JSON.stringify(userDefaultAddress)
			) {
				const updatedAddresses =
					data?.addresses?.map((address) => {
						const { altPhone, ...rest } = address;
						return altPhone?.number
							? { ...rest, altPhone }
							: { ...rest };
					}) ?? [];

				const defaultIndex = parseInt(data.defaultAddressIndex, 10);
				const defaultAddress = updatedAddresses[defaultIndex] ?? null;

				formData.append("addresses", JSON.stringify(updatedAddresses));
				formData.append(
					"defaultAddress",
					JSON.stringify(defaultAddress)
				);

				hasChanges = true;
			}

			// Nothing to update
			if (!hasChanges) {
				console.log("Nothing updated");
				return;
			}

			const response = await updateProfile(formData);

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			response.success
				? toast.success(response.message)
				: toast.error(response.message);
		} catch (error) {
			console.log("Error updating profile: ", (error as Error).message);
			toast.error("Error updating profile");
		} finally {
			setEditMode(false);
			setIsSubmitting(false);
		}
	};

	// Form validation errors
	const onError = (errors: unknown) => {
		console.log("Form errors:", errors);
	};

	const handleProfileImageChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageURL = URL.createObjectURL(file);
			setPreviewImage(imageURL);
			setDeletedProfileImage(true);
		}
	};

	const handleProfileImageDelete = () => {
		setPreviewImage("");
		setDeletedProfileImage(true);
	};

	const getEditAddressData = (): Partial<AddressFormType> | undefined => {
		if (editIndex === null) return undefined;
		const addresses = form.getValues("addresses");
		return addresses?.[editIndex];
	};

	return (
		<section className="w-screen relative min-h-screen pt-12 sm:pt-24 md:pt-40 pb-20 px-6 md:px-20 flex flex-col justify-center items-center gap-10">
			<div className="w-full min-h-screen md:w-3xl bg-section-background border-2 rounded-xl p-4 md:p-6">
				{isLoadingAuth ? (
					<div className="w-full h-screen flex justify-center items-center">
						<Loader className="text-center" />
					</div>
				) : (
					<>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
								className="w-full space-y-6"
							>
								<div className="relative flex flex-col justify-start items-center gap-6">
									<Avatar className="size-36 relative group overflow-visible">
										{editMode && previewImage && (
											<button
												type="button"
												onClick={
													handleProfileImageDelete
												}
												className="absolute top-0 -right-5 transition-colors group duration-200"
											>
												<X className="size-5 md:size-6 hover:stroke-secondary-foreground" />
											</button>
										)}
										<AvatarImage
											src={previewImage}
											key={previewImage}
											className="w-full h-full rounded-full object-cover"
										/>
										<AvatarFallback className="text-3xl w-full h-full rounded-full object-cover">
											{user?.username
												?.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
										{editMode && (
											<div className="w-full h-full rounded-full overflow-hidden absolute inset-0 flex justify-center items-center gap-2 z-10 cursor-pointer bg-black/40 backdrop-blur-xl opacity-0 transition-all duration-300 hover:opacity-100">
												<FormField
													control={form.control}
													name="profileImage"
													render={({
														field: {
															onChange,
															ref,
														},
													}) => (
														<FormItem>
															<FormLabel className="w-[200px] h-[200px] flex flex-col justify-center items-center cursor-pointer">
																<Camera className="size-8 mx-auto" />
																<span>
																	Upload Image
																</span>
															</FormLabel>
															<FormControl>
																<Input
																	type="file"
																	accept="image/*"
																	ref={ref}
																	className="hidden"
																	onChange={(
																		event
																	) => {
																		handleProfileImageChange(
																			event
																		);
																		onChange(
																			event
																				.target
																				.files
																		);
																	}}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}
									</Avatar>
									{editMode ? (
										<div className="flex gap-2">
											<button
												type="submit"
												className="btn-primary"
											>
												Save Profile
											</button>
											<button
												type="button"
												className="btn-secondary"
												onClick={() => {
													setEditMode(false);
													setShowAddressForm(false);
													setEditIndex(null);
													// Reset form to original data
													if (originalFormData) {
														form.reset(
															originalFormData
														);
													}
													setPreviewImage(
														user?.profileImage || ""
													);
												}}
											>
												<span>Cancel</span>
											</button>
										</div>
									) : (
										<button
											type="button"
											className="btn-secondary"
											onClick={() => setEditMode(true)}
										>
											{isSubmitting ? (
												<Loader className="w-6 h-6 animate-spin" />
											) : (
												<span className="flex justify-center items-center gap-2">
													<Edit />
													Edit Profile
												</span>
											)}
										</button>
									)}
								</div>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Username
												{editMode && (
													<Asterisk className="size-3 stroke-destructive" />
												)}
											</FormLabel>
											<FormControl>
												<Input
													disabled={
														!editMode ||
														isSubmitting
													}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													disabled
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-4 mb-4">
									{Boolean(user?.addresses?.length) && (
										<h3 className="text-lg font-semibold">
											Saved Addresses
										</h3>
									)}
									<FormField
										control={form.control}
										name="defaultAddressIndex"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<RadioGroup
														value={field.value}
														onValueChange={
															field.onChange
														}
														disabled={
															!editMode ||
															isSubmitting
														}
														className="space-y-4"
													>
														{fields.map(
															(item, index) => (
																<div
																	key={
																		item.id
																	}
																	className="flex max-md:flex-col items-start md:items-center justify-between gap-4 border p-4 rounded-md"
																>
																	<div className="space-y-1">
																		<p className="font-medium">
																			{
																				item.street
																			}
																			,{" "}
																			{
																				item.city
																			}
																		</p>
																		<p className="text-sm text-muted-foreground">
																			{
																				item.state
																			}
																			,{" "}
																			{
																				item.country
																			}{" "}
																			-{" "}
																			{
																				item.zip
																			}
																		</p>
																		<p className="text-sm">
																			📞{" "}
																			{
																				item
																					.phone
																					?.countryCode
																			}{" "}
																			{
																				item
																					.phone
																					?.number
																			}
																		</p>
																		{item
																			.altPhone
																			?.number && (
																			<p className="text-sm">
																				📞{" "}
																				{
																					item
																						.altPhone
																						?.countryCode
																				}{" "}
																				{
																					item
																						.altPhone
																						?.number
																				}
																			</p>
																		)}
																	</div>
																	<div className="flex items-center gap-4">
																		<div className="flex items-center space-x-2">
																			<RadioGroupItem
																				value={String(
																					index
																				)}
																				id={`default-${index}`}
																				className="size-4 border-2 border-input-border text-secondary-foreground"
																			/>
																			<Label
																				htmlFor={`default-${index}`}
																				className="text font-semibold cursor-pointer"
																			>
																				Default
																			</Label>
																		</div>
																		{editMode && (
																			<div className="space-x-2">
																				<button
																					type="button"
																					onClick={() =>
																						handleEditAddress(
																							index
																						)
																					}
																					className="group"
																				>
																					<Edit className="size-4 md:size-5 stroke-text hover:stroke-accent transition-colors duration-200" />
																				</button>
																				<button
																					type="button"
																					onClick={() =>
																						handleRemoveAddress(
																							index
																						)
																					}
																					className="group"
																				>
																					<Trash2 className="size-4 md:size-5 stroke-text  hover:stroke-accent transition-colors duration-200" />
																				</button>
																			</div>
																		)}
																	</div>
																</div>
															)
														)}
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</form>
						</Form>

						{editMode && (
							<div className="w-full space-y-4 mb-6">
								<div className="w-full flex justify-between items-center gap-4">
									<h3 className="text-lg font-semibold">
										Address
									</h3>
									{!showAddressForm && (
										<button
											type="button"
											onClick={() =>
												setShowAddressForm(true)
											}
											className="text-sm py-1.5 px-2 rounded-md border-2 border-button-border transition-colors duration-300 hover:bg-foreground hover:text-gray-900"
										>
											Add New Address
										</button>
									)}
								</div>

								{showAddressForm && (
									<AddressForm
										setShowAddressForm={setShowAddressForm}
										onSave={handleSaveNewAddress}
										onCancel={handleCancelNewAddress}
										initialData={getEditAddressData()}
										isEditMode={editIndex !== null}
									/>
								)}
							</div>
						)}

						<Link
							to="/auth/forgot-password"
							className="bg-gray-700 border-2 rounded-lg py-1 px-2 text-sm font-medium hover:bg-gray-600"
						>
							Change password
						</Link>
					</>
				)}
			</div>

			{/* Floating shapes */}
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

export default ProfilePage;
