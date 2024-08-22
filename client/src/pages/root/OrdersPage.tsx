import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import pizza_placeholder from "../../assets/images/pizza-placeholder.png";
import { OrderStatus } from "@/types/OrderState";
import { ChevronRight, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";
import { motion } from "motion/react";

const OrdersPage = () => {
	const navigate = useNavigate();

	const orders = useOrderStore((state) => state.orders);
	const getOrdersByUser = useOrderStore((state) => state.getOrdersByUser);
	const isLoadingOrders = useOrderStore((state) => state.isLoading);

	useEffect(() => {
		getOrdersByUser();
	}, [getOrdersByUser]);

	return (
		<section className="w-screen min-h-screen relative pt-20 sm:pt-30 md:pt-40 pb-20 px-8 md:px-20">
			<div className="w-full flex justify-between items-center">
				<h2 className="heading-2 mb-4">My Orders</h2>
			</div>

			<Separator />

			<div className="w-full bg-section-background flex flex-col justify-start items-center gap-2 border-2 rounded-xl p-4 md:p-6">
				{!isLoadingOrders && orders.length ? (
					<>
						{[...orders].reverse().map((order) => (
							<div
								key={order._id}
								onClick={() => navigate(`/orders/${order._id}`)}
								className="bg-card w-full flex justify-start items-start gap-6 rounded-lg py-4 px-4 cursor-pointer transition-colors duration-300 hover:bg-card/70"
							>
								<div className="w-[100px] sm:w-[150px] md:w-[200px] grid grid-cols-2 grid-rows-2 gap-2">
									{order.items
										.slice(0, 3)
										.map((item, idx) => (
											<img
												key={idx}
												src={
													item.images?.[0] ??
													pizza_placeholder
												}
												alt="pizza image"
												className="w-full h-full rounded-lg object-cover"
											/>
										))}
									<div className="flex justify-center items-center">
										<p className="h-10 w-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 flex justify-center items-center m-1 sm:m-2 text-sm">
											+ {order.items.length - 3}
										</p>
									</div>
								</div>
								<div className="flex-3 flex flex-col justify-center items-start gap-6">
									<div className="w-full">
										{order.items
											.slice(0, 4)
											.map((item, idx) => (
												<p
													key={idx}
													className="text-xs sm:text-sm md:text-lg tracking-wide inline"
												>
													{item.name}
													{idx < 3 && ", "}
												</p>
											))}
										<p className="text-xs sm:text-sm md:text-lg tracking-wide inline">
											{" "}
											({order.items.length} items)
										</p>
									</div>

									<p className="text-xs md:text-sm text-text">
										{order.status === OrderStatus.Delivered
											? "Delivered"
											: order.status ===
											  OrderStatus.Cancelled
											? "Cancelled"
											: "Ordered"}{" "}
										on{" "}
										{new Date(
											order.fulfilledOn
										).toLocaleString()}
									</p>

									{order.status !== OrderStatus.Delivered &&
										order.status !==
											OrderStatus.Cancelled && (
											<p className="text-xs md:text-sm text-subtitle">
												Your order is being prepared...
											</p>
										)}
								</div>

								<ChevronRight className="w:6 h-6 md:w-7 md:h-7 my-auto" />
							</div>
						))}
					</>
				) : (
					<p className="text text-center my-52">
						{isLoadingOrders ? (
							<Loader className="w-6 h-6 animate-spin mx-auto" />
						) : (
							"No orders to show"
						)}
					</p>
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

export default OrdersPage;
