import { OrderStatus } from "@/types/OrderState";
import { z } from "zod";

export const orderStatusSchema = z.object({
	status: z.enum(
		[
			OrderStatus.Pending,
			OrderStatus.Confirmed,
			OrderStatus.Preparing,
			OrderStatus.Delivered,
			OrderStatus.Cancelled,
		],
		{
			required_error: "Status is required",
		}
	),
});
export type OrderStatusFormType = z.infer<typeof orderStatusSchema>;
