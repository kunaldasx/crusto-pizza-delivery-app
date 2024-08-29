import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrderStatus, OrderType } from "@/types/OrderState";
import OrderItemCard from "@/components/OrderItemCard";
import { Progress } from "@/components/ui/progress";
import { getOrderProgress, getProgressColor } from "@/lib/orderUtils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import OrderStatusForm from "@/components/forms/OrderStatusForm";

const OrderPage = () => {
	const { id } = useParams(); // id from URL
	const allOrders = useOrderStore((state) => state.allOrders);
	const getAllOrders = useOrderStore((state) => state.getAllOrders);
	const isLoadingOrder = useOrderStore((state) => state.isLoading);

	const [order, setOrder] = useState<OrderType | null>(null);

	useEffect(() => {
		getAllOrders();
	}, [getAllOrders]);

	useEffect(() => {
		// ✅ Filter based on `id` from useParams
		if (!isLoadingOrder && id) {
			const matchedOrder = allOrders.find((order) => order._id === id);
			if (matchedOrder) setOrder(matchedOrder);
		}
	}, [allOrders, id, isLoadingOrder]);

	return (
		<section className="bg-section-background min-h-screen relative py-6 px-6 sm:px-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard/orders">Orders</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink className="text-foreground" asChild>
							<Link to={`/dashboard/orders/${id}`}>Order</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{!isLoadingOrder && order?.items.length ? (
				<div className="w-full bg-popover border-2 p-4 mt-12 rounded-xl">
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

					<div className="w-full flex max-lg:flex-col-reverse justify-center max-lg:items-center items-start gap-8 pt-10">
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

						<div className="w-full lg:max-w-[400px] flex flex-col justify-start items-start gap-6">
							{/* Status update form */}
							<div className="w-full bg-card py-2 px-4 border-2 rounded-lg">
								<OrderStatusForm
									orderId={order._id}
									orderStatus={order.status}
								/>
							</div>

							{/* Delivery Address */}
							<div className="w-full flex flex-col justify-center items-start gap-2">
								<p className="text-lg font-medium">
									Delivery Address:
								</p>
								<div className="w-full border p-4 rounded-md space-y-1">
									<p className="text-sm font-medium">
										{order.deliveryAddress.street},{" "}
										{order.deliveryAddress.city}
									</p>
									<p className="text-sm text-muted-foreground">
										{order.deliveryAddress.state},{" "}
										{order.deliveryAddress.country} -{" "}
										{order.deliveryAddress.zip}
									</p>
									<p className="text-sm">
										📞{" "}
										{
											order.deliveryAddress.phone
												?.countryCode
										}{" "}
										{order.deliveryAddress.phone?.number}
									</p>
									{order.deliveryAddress.altPhone?.number && (
										<p className="text-sm">
											📞{" "}
											{
												order.deliveryAddress.altPhone
													?.countryCode
											}{" "}
											{
												order.deliveryAddress.altPhone
													?.number
											}
										</p>
									)}
								</div>
							</div>

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
		</section>
	);
};

export default OrderPage;
