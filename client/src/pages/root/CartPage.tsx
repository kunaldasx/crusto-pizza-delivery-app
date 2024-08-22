import CartItemCard from "@/components/CartItemCard";
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
import { createOrderItems, loadRazorpayScript } from "@/lib/orderUtils";
import { AddressFormType } from "@/schemas/profile.schema";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AddressForm from "@/components/forms/AddressFrom";
import { useDashboardStore } from "@/store/useDashboardStore";
import { ActivityCategory } from "@/types/DashboardState";
import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Razorpay: new (options: any) => any;
	}
}

interface RazorpayResponse {
	razorpay_payment_id: string;
	razorpay_order_id: string;
	razorpay_signature: string;
}

const discount = 36;

const CartPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const user = useAuthStore((state) => state.user);
	const updateProfile = useAuthStore((state) => state.updateProfile);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const setIntendedRoute = useAuthStore((state) => state.setIntendedRoute);

	const cart = useCartStore((state) => state.cart);
	const syncCart = useCartStore((state) => state.syncCart);
	const clearCart = useCartStore((state) => state.clearCart);
	const isLoadingCart = useCartStore((state) => state.isLoading);

	const createOrder = useOrderStore((state) => state.createOrder);
	const verifyPayment = useOrderStore((state) => state.verifyPayment);

	const addActivity = useDashboardStore((state) => state.addActivity);

	const [isLoadingOrder, setIsLoadingOrder] = useState(false);
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [unavailableItems, setUnavailableItems] = useState(false);

	useEffect(() => {
		if (!isLoadingCart && cart?.items.length) {
			cart.items.map((item) => {
				if (!item.pizza.isAvailable) setUnavailableItems(true);
			});
		}
	}, [cart, isLoadingCart]);

	const navigateToLogin = () => {
		setIntendedRoute(location.pathname); // Save where they came from
		navigate("/auth/login");
	};

	const handleClearCart = async () => {
		const response = await clearCart(user?._id ?? null);

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		response.success
			? toast.success(response.message)
			: toast.error(response.message);
	};

	const handleCheckout = async (amount: number) => {
		try {
			setIsLoadingOrder(true);
			if (!isAuthenticated && !user) {
				toast.message("Please login to make an order");
				return;
			}

			if (!cart?.items.length) {
				toast.error("No items in cart");
				return;
			}

			if (!user?.defaultAddress) {
				toast.message("Please provide an address");
				setShowAddressForm(true);
				return;
			}

			const deliveryAddress = user.defaultAddress;

			// Razorpay script
			const isLoaded = await loadRazorpayScript();
			if (!isLoaded) {
				console.log("Razorpay SDK failed to load.");
				return;
			}

			const response = await createOrder(amount);

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			response.success
				? toast.success(response.message)
				: toast.error(response.message);

			if (!response.order) {
				console.log("No order received from createOrder");
				return;
			}

			const {
				id: order_id,
				amount: order_amount,
				currency,
			} = response.order;

			const items = createOrderItems(cart.items);

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID,
				amount: order_amount,
				currency,
				name: "Crusto",
				description: "Order Payment",
				order_id,
				handler: async function (response: RazorpayResponse) {
					const order = {
						user: user._id,
						items,
						orderTotalPrice: cart?.cartTotalPrice
							? Math.round(
									(cart.cartTotalPrice - discount) * 100
							  ) / 100
							: 0,
						deliveryAddress,
						razorpayOrderId: response.razorpay_order_id,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpaySignature: response.razorpay_signature,
					};
					const verifyResponse = await verifyPayment(order);

					if (verifyResponse.success) {
						// Save activity
						const activity = {
							type: ActivityCategory.Order,
							username: user.username,
							timestamp: new Date(),
							metadata: {
								orderId: response.razorpay_order_id,
								totalItems: items.length,
								price: cart?.cartTotalPrice
									? Math.round(
											(cart.cartTotalPrice - discount) *
												100
									  ) / 100
									: 0,
							},
						};
						await addActivity(activity);
						await syncCart(user._id);
						toast.success(verifyResponse.message);
						navigate("/order-success");
					} else {
						toast.error(verifyResponse.message);
					}
				},
				theme: { color: "#F37254" },
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (error) {
			console.log("Error checking out", (error as Error).message);
		} finally {
			setIsLoadingOrder(false);
		}
	};

	const onSaveAddress = async (addressData: AddressFormType) => {
		const formData = new FormData();
		formData.append("addresses", JSON.stringify(addressData));
		formData.append("defaultAddress", JSON.stringify(addressData));

		const response = await updateProfile(formData);

		if (response.success) {
			setShowAddressForm(false);
			toast.success(response.message);
		}
	};

	const onCancel = () => {
		setShowAddressForm(false);
	};

	return (
		<section className="w-screen min-h-screen relative pt-20 sm:pt-30 md:pt-40 pb-20 px-8 md:px-20">
			<div className="w-full flex justify-between items-center">
				<h2 className="heading-2 mb-4">My Cart</h2>
				{(cart?.items.length ?? 0) > 0 && (
					<AlertDialog>
						<AlertDialogTrigger className="flex justify-center items-center gap-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-1 sm:py-1.5 px-2 rounded-md transition-colors hover:bg-destructive mb-4">
							<Trash2 className="w-4" /> Clear cart
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-popover border-2 py-6 px-8">
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure, you want to clear🚫
									your cart ?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your cart and remove it's
									data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground hover:text-black 60">
									<span>Cancel</span>
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleClearCart}
									className="bg-destructive text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-destructive/60"
								>
									Clear cart
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>

			<Separator />

			<div className="w-full bg-section-background flex max-lg:flex-col-reverse justify-center max-lg:items-center items-start gap-8 border-2 rounded-xl p-4 md:p-6">
				{!isLoadingCart && cart?.items.length ? (
					<>
						<motion.ul
							initial={{ y: -30, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="w-full space-y-4"
						>
							{[...cart.items].reverse().map((item) => (
								<li key={item._id} className="w-full">
									<CartItemCard item={item} />
								</li>
							))}
						</motion.ul>

						<div className="w-full sm:w-[500px] flex flex-col justify-start items-start gap-2">
							<h2 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-wide">
								Summary
							</h2>
							<Separator />
							<ul className="w-full flex flex-col justify-start items-center gap-2">
								{cart?.items.map((item) => (
									<li
										key={item._id}
										className="min-w-full flex justify-between items-center gap-4"
									>
										<p className="text-sm lg:text-[16px]">
											{item.pizza.name}
										</p>

										<p className="text-sm lg:text-[16px] whitespace-nowrap">
											₹ {item.basePrice.toFixed(2)}
											<span className="text-muted-foreground mx-2">
												x
											</span>
											{item.quantity}
										</p>
									</li>
								))}
							</ul>
							<Separator />
							<div className="w-full flex justify-between items-center gap-4">
								<p className="text-sm lg:text-[16px] font-semibold">
									Total:
								</p>
								<p className="text-sm lg:text-[16px] font-semibold">
									₹ {(cart?.cartTotalPrice ?? 0).toFixed(2)}
								</p>
							</div>

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
									₹{" "}
									{(cart?.cartTotalPrice
										? cart.cartTotalPrice - discount
										: 0
									).toFixed(2)}
								</p>
							</div>

							{/* Checkout button */}
							{unavailableItems ? (
								// Cart contains unavailable items
								<>
									<AlertDialog>
										<AlertDialogTrigger className="w-full btn-primary mt-4">
											Checkout
										</AlertDialogTrigger>
										<AlertDialogContent className="bg-popover border-2 py-6 px-8">
											<AlertDialogHeader>
												<AlertDialogTitle>
													Cart contains unavailable
													items
												</AlertDialogTitle>
												<AlertDialogDescription>
													Please remove all
													unavailable items from the
													cart.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="bg-foreground text-gray-800 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground/70">
													<span>Okay</span>
												</AlertDialogCancel>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</>
							) : !isAuthenticated ? (
								// Prompt to Login
								<>
									<AlertDialog>
										<AlertDialogTrigger className="w-full btn-primary mt-4">
											Checkout
										</AlertDialogTrigger>
										<AlertDialogContent className="bg-popover border-2 py-6 px-8">
											<AlertDialogHeader>
												<AlertDialogTitle>
													Login required
												</AlertDialogTitle>
												<AlertDialogDescription>
													Please login to continue
													with your purchase.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground hover:text-black">
													<span>Cancel</span>
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={navigateToLogin}
													className="bg-foreground text-black text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide border-2 py-3 px-12 rounded-lg transition-colors hover:bg-foreground/70"
												>
													Login
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</>
							) : (
								// Authenticated
								<button
									onClick={() =>
										handleCheckout(
											cart?.cartTotalPrice
												? cart.cartTotalPrice - discount
												: 0
										)
									}
									disabled={isLoadingOrder}
									className="w-full btn-primary mt-4"
								>
									{isLoadingOrder ? (
										<Loader className="w-6 h-6 animate-spin mx-auto" />
									) : (
										"Checkout"
									)}
								</button>
							)}
						</div>
					</>
				) : (
					<p className="text text-center my-52">
						{isLoadingCart ? (
							<Loader className="w-6 h-6 animate-spin mx-auto" />
						) : (
							"No items in cart"
						)}
					</p>
				)}
			</div>

			{showAddressForm && (
				<AddressForm
					setShowAddressForm={setShowAddressForm}
					onSave={onSaveAddress}
					onCancel={onCancel}
				/>
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

export default CartPage;
