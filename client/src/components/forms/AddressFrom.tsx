import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { addressSchema, AddressFormType } from "@/schemas/profile.schema";
import { Asterisk, X } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "../ui/input";

interface AddressFormProps {
	setShowAddressForm: React.Dispatch<React.SetStateAction<boolean>>;
	onSave: (address: AddressFormType) => void;
	onCancel: () => void;
	initialData?: Partial<AddressFormType>;
	isEditMode?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
	setShowAddressForm,
	onSave,
	onCancel,
	initialData,
	isEditMode = false,
}) => {
	const form = useForm<AddressFormType>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			street: initialData?.street || "",
			city: initialData?.city || "",
			state: initialData?.state || "",
			zip: initialData?.zip || "",
			country: initialData?.country || "",
			phone: {
				countryCode: initialData?.phone?.countryCode || "",
				number: initialData?.phone?.number || "",
			},
			altPhone: {
				countryCode: initialData?.altPhone?.countryCode || "",
				number: initialData?.altPhone?.number || "",
			},
		},
	});

	const onSubmit = async (data: AddressFormType) => {
		try {
			onSave(data);

			// Reset form if it's not edit mode
			if (!isEditMode) {
				form.reset();
			}
		} catch (error) {
			console.log("Failed to save address");
		}
	};

	const handleCancel = () => {
		form.reset();
		onCancel();
	};

	const onError = (errors: any) => {
		console.log("Form errors:", errors);
	};

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
				onClick={() => setShowAddressForm(false)}
			/>

			{/* Popover Content */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				transition={{ duration: 0.3 }}
				className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[40%] max-h-[90%] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border-2 rounded-lg shadow-xl z-70 overflow-y-auto px-8 py-12"
			>
				<div className="flex flex-col justify-start items-center gap-8">
					<h4 className="w-fit text-xl font-semibold text-heading tracking-wider border-2 p-2 rounded-lg">
						{isEditMode ? "Edit Address" : "Add New Address"}
					</h4>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, onError)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="street"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Street
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter street address" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											City
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter city" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											State
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter state" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="zip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											ZIP Code
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter ZIP code" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Country
											<Asterisk className="size-3 stroke-destructive" />
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter country" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="phone.countryCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="leading-snug">
												Phone Country Code
												<Asterisk className="size-3 stroke-destructive" />
											</FormLabel>
											<FormControl>
												<Input placeholder="+1" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phone.number"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="leading-snug">
												Phone Number
												<Asterisk className="size-3 stroke-destructive" />
											</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Enter phone number" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="altPhone.countryCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="leading-snug">
												Alt Phone Country Code (Optional)
											</FormLabel>
											<FormControl>
												<Input placeholder="+1" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="altPhone.number"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="leading-snug">
												Alt Phone Number (Optional)
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Enter alt phone number"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex pt-2 gap-2">
								<button
									type="submit"
									className="text-sm bg-foreground text-black py-1.5 px-2 rounded-md border-2 border-button-border transition-colors duration-300 hover:bg-foreground/70"
								>
									{isEditMode ? "Update Address" : "Save Address"}
								</button>
								<button
									type="button"
									onClick={handleCancel}
									className="text-sm py-1.5 px-2 rounded-md border-2 border-button-border transition-colors duration-300 hover:bg-foreground hover:text-black"
								>
									<span>Cancel</span>
								</button>
							</div>
						</form>
					</Form>
				</div>
				<button
					onClick={() => setShowAddressForm(false)}
					className="fixed top-2 right-2 sm:top-5 sm:right-5 p-2 rounded-lg transition-colors hover:bg-muted duration-200"
				>
					<X className="w-4 h-4 sm:w-5 sm:h-5" />
				</button>
			</motion.div>
		</>
	);
};

export default AddressForm;
