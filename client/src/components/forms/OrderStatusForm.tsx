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
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { OrderStatusFormType, orderStatusSchema } from "@/schemas/order.schema";
import { OrderStatus } from "@/types/OrderState";
import { useOrderStore } from "@/store/useOrderStore";

const OrderStatusForm = ({
	orderId,
	orderStatus,
}: {
	orderId: string;
	orderStatus: OrderStatus;
}) => {
	const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastSubmittedStatus, setLastSubmittedStatus] = useState(orderStatus);

	const form = useForm<OrderStatusFormType>({
		resolver: zodResolver(orderStatusSchema),
		defaultValues: {
			status: orderStatus,
		},
	});

	// Update Order Status
	const handleUpdateStatus = async (status: OrderStatus): Promise<void> => {
		if (status === lastSubmittedStatus || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);

			const response = await updateOrderStatus(orderId, status);

			if (response.success) {
				toast.success(response.message);
				setLastSubmittedStatus(status);
			} else {
				toast.error(response.message);
				// ✅ Error recovery
				form.setValue("status", lastSubmittedStatus);
			}
		} catch (error) {
			toast.error("Failed to update order status");
			console.log("Order status form: ", error);
			// ✅ Reset to last known good state
			form.setValue("status", lastSubmittedStatus);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Debounced update function
	const debouncedUpdateStatus = useCallback(
		debounce((status: OrderStatus) => {
			handleUpdateStatus(status);
		}, 500),
		[orderId, lastSubmittedStatus, isSubmitting]
	);

	// Watch for status changes
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "status" && value.status !== undefined) {
				const status = value.status;

				if (status !== lastSubmittedStatus) {
					debouncedUpdateStatus(status);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form, debouncedUpdateStatus, lastSubmittedStatus]);

	// Sync with prop changes
	useEffect(() => {
		if (orderStatus !== lastSubmittedStatus) {
			form.setValue("status", orderStatus);
			setLastSubmittedStatus(orderStatus);
		}
	}, [orderStatus, form, lastSubmittedStatus]);

	// Cleanup
	useEffect(() => {
		return () => {
			debouncedUpdateStatus.cancel();
		};
	}, [debouncedUpdateStatus]);

	return (
		<Form {...form}>
			<form className="w-full mb-4">
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-medium tracking-wide">
								Order status
								{isSubmitting && (
									<span className="text-xs text-muted-foreground ml-2">
										Updating...
									</span>
								)}
							</FormLabel>
							<FormControl>
								<Select
									key={`status-select-${field.value}`}
									onValueChange={field.onChange}
									value={field.value}
								>
									<SelectTrigger className="w-full px-6 border-2 border-border">
										<SelectValue placeholder="Select order status" />
									</SelectTrigger>
									<SelectContent className="z-150">
										<SelectGroup>
											<SelectLabel>Status</SelectLabel>
											<SelectItem
												value={OrderStatus.Pending}
											>
												Pending
											</SelectItem>
											<SelectItem
												value={OrderStatus.Confirmed}
											>
												Confirmed
											</SelectItem>
											<SelectItem
												value={OrderStatus.Preparing}
											>
												Preparing
											</SelectItem>
											<SelectItem
												value={
													OrderStatus.OutForDelivery
												}
											>
												Out for delivery
											</SelectItem>
											<SelectItem
												value={OrderStatus.Delivered}
											>
												Delivered
											</SelectItem>
											<SelectItem
												value={OrderStatus.Cancelled}
											>
												Cancelled
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default OrderStatusForm;
