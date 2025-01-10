import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pizza_placeholder from "../../assets/images/pizza-placeholder.png";
import { OrderStatus, OrderType } from "@/types/OrderState";
import { AspectRatio } from "../ui/aspect-ratio";

const Orders = ({ orders }: { orders?: OrderType[] }) => {
	const navigate = useNavigate();

	return (
		<>
			{orders?.length ? (
				<div className="w-full bg-popover flex flex-col justify-start items-center gap-6 border-2 p-4 md:p-6 rounded-xl mt-6 md:mt-12">
					{[...orders].reverse().map((order) => (
						<div
							key={order._id}
							onClick={() => navigate(`/dashboard/orders/${order._id}`)}
							className="bg-card w-full flex justify-start items-start gap-6 rounded-lg py-4 px-4 cursor-pointer transition-colors duration-300 hover:bg-card/70"
						>
							<div
								className="w-[100px] sm:w-[150px] md:w-[200px]"
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
									gridTemplateRows: "repeat(2, 1fr)",
									aspectRatio: "1", // Ensures the container is square
									gap: "10px",
								}}
							>
								{order.items.slice(0, 3).map((item, idx) => (
									<AspectRatio key={idx} ratio={1 / 1}>
										<img
											src={item.images?.[0] ?? pizza_placeholder}
											alt="pizza image"
											className="w-full h-full rounded-lg object-cover"
										/>
									</AspectRatio>
								))}
								{order.items.length - 3 > 0 && (
									<div className="flex justify-center items-center">
										<p className="h-10 w-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 flex justify-center items-center m-1 sm:m-2 text-sm">
											+ {order.items.length - 3}
										</p>
									</div>
								)}
							</div>
							<div className="flex-3 flex flex-col justify-center items-start gap-6">
								<div className="w-full">
									{(() => {
										const displayItems = order.items.slice(0, 4);
										return displayItems.map((item, idx) => (
											<p
												key={idx}
												className="text-xs sm:text-sm md:text-lg tracking-wide inline"
											>
												{item.name}
												{idx < displayItems.length - 1 && ", "}
											</p>
										));
									})()}
									<p className="text-xs sm:text-sm md:text-lg tracking-wide inline">
										{" "}
										({order.items.length} items)
									</p>
								</div>

								<p className="text-xs md:text-sm text-text">
									{order.status === OrderStatus.Delivered
										? "Delivered"
										: order.status === OrderStatus.Cancelled
										? "Cancelled"
										: "Ordered"}{" "}
									on {new Date(order.fulfilledOn).toLocaleString()}
								</p>

								{/* Delivery Address */}
								<div className="w-full flex flex-col justify-center items-start gap-2">
									<p className="text-sm text-text">Delivery Address:</p>
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
											📞 {order.deliveryAddress.phone?.countryCode}{" "}
											{order.deliveryAddress.phone?.number}
										</p>
										{order.deliveryAddress.altPhone?.number && (
											<p className="text-sm">
												📞 {order.deliveryAddress.altPhone?.countryCode}{" "}
												{order.deliveryAddress.altPhone?.number}
											</p>
										)}
									</div>
								</div>

								<div className="flex flex-col justify-center items-start">
									<p className="text-sm text-text">Order status:</p>
									<p className="text-sm font-semibold text-foreground tracking-wider capitalize">
										{order.status}
									</p>
								</div>
							</div>

							<ChevronRight className="w:6 h-6 md:w-7 md:h-7 my-auto" />
						</div>
					))}
				</div>
			) : (
				<p className="text-center text my-52">No orders found</p>
			)}
		</>
	);
};

export default Orders;
