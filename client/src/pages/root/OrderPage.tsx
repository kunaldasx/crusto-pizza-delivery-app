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
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrderStatus, OrderType } from "@/types/OrderState";
import OrderItemCard from "@/components/OrderItemCard";
import { Progress } from "@/components/ui/progress";
import { getOrderProgress, getProgressColor } from "@/lib/orderUtils";
import { toast } from "sonner";
import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";

const OrderPage = () => {
	const { id } = useParams(); // id from URL
	const orders = useOrderStore((state) => state.orders);
	const getOrdersByUser = useOrderStore((state) => state.getOrdersByUser);
	const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
	const isLoadingOrder = useOrderStore((state) => state.isLoading);

	const [order, setOrder] = useState<OrderType | null>(null);

	useEffect(() => {
		getOrdersByUser();
	}, []);

	useEffect(() => {
		// ✅ Filter based on `id` from useParams
		if (!isLoadingOrder && id) {
			const matchedOrder = orders.find((order) => order._id === id);
			if (matchedOrder) setOrder(matchedOrder);
		}
	}, [orders, id, isLoadingOrder]);

	const handleCancelOrder = async () => {
		if (!order) return;

		const response = await updateOrderStatus(
			order._id,
			OrderStatus.Cancelled
		);

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		response.success
			? toast.success(response.message)
			: toast.error(response.message);
	};

	return (
		<section className="w-screen min-h-screen relative pt-20 sm:pt-30 md:pt-40 pb-20 px-6 md:px-20">
			<div className="w-full flex justify-between items-center">
				<h2 className="heading-2 mb-4">My Order</h2>
			</div>

			{!isLoadingOrder && order?.items.length ? (
				<div className="w-full bg-section-background border-2 p-4 rounded-xl">
					<div className="w-full space-y-4">
						<p className="text">
							Order on{" "}
							{new Date(order.orderedOn).toLocaleString()}
						</p>
						<p className="text-lg font-semibold capitalize">
							{order?.status === OrderStatus.OutForDelivery
								? "Out for delivery"
								: order.status}
						</p>
						<Progress
							value={getOrderProgress(
								order.status as OrderStatus
							)}
							className={getProgressColor(
								order.status as OrderStatus
							)}
						/>
					</div>

					<div className="w-full flex max-lg:flex-col-reverse justify-center max-lg:items-center items-start gap-8 md:pt-10">
						<motion.ul
							initial={{ y: -30, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="flex-1 space-y-2"
						>
							{order.items.map((item, idx) => (
								<li key={idx} className="w-full">
									<OrderItemCard item={item} />
								</li>
							))}
						</motion.ul>

						<div className="w-full lg:max-w-[400px] flex flex-col justify-start items-start gap-2">
							<h2 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-wide">
								Summary
							</h2>
							<Separator />
							<ul className="w-full flex flex-col justify-start items-center gap-2">
								{order?.items.map((item, idx) => (
									<li
										key={idx}
										className="min-w-full flex justify-between items-center gap-4"
									>
										<p className="text-sm lg:text-[16px]">
											{item.name}
										</p>

										<p className="text-sm lg:text-[16px] whitespace-nowrap">
											₹ {item.totalPrice.toFixed(2)}
										</p>
									</li>
								))}
							</ul>
							<Separator />

							<div className="w-full flex justify-between items-center gap-4">
								<p className="text-sm lg:text-[16px]">
									Shipping:
								</p>
								<p className="text-sm lg:text-[16px]">Free</p>
							</div>

							<div className="w-full flex justify-between items-center gap-4">
								<p className="text-sm lg:text-[16px]">
									Discount:
								</p>
								<p className="text-sm lg:text-[16px]">₹ 36</p>
							</div>

							<Separator />

							<div className="w-full flex justify-between items-center gap-4">
								<p className="text-subtitle text-sm lg:text-[16px] font-bold">
									Grand Total:
								</p>
								<p className="text-sm lg:text-[16px] font-bold">
									₹ {order.orderTotalPrice.toFixed(2)}
								</p>
							</div>

							{order.status === OrderStatus.Cancelled ||
							order.status == OrderStatus.Preparing ||
							order.status == OrderStatus.OutForDelivery ||
							order.status == OrderStatus.Delivered ? (
								<div className="w-full btn-muted mt-4 capitalize">
									{order.status}
								</div>
							) : (
								<>
									<AlertDialog>
										<AlertDialogTrigger className="w-full btn-primary mt-4">
											Cancel order
										</AlertDialogTrigger>
										<AlertDialogContent className="bg-popover border-2 py-6 px-8">
											<AlertDialogHeader>
												<AlertDialogTitle>
													Cancel order🚫
												</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to
													cancel this order? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground hover:text-black">
													<span>Cancel</span>
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleCancelOrder}
													className="bg-destructive text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-destructive/70"
												>
													Confirm
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</>
							)}
						</div>
					</div>
				</div>
			) : (
				<p className="text text-center my-52">
					{isLoadingOrder ? (
						<Loader className="w-6 h-6 animate-spin mx-auto" />
					) : (
						"Order not found"
					)}
				</p>
			)}

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

export default OrderPage;
