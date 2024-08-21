import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "../widgets/Logo";
import { Loader, LogOut, Mail, Phone, ShoppingCartIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { Badge } from "../ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomPizzaStore } from "@/store/useCustomPizzaStore";
import { toast } from "sonner";
import { navLinksMobile } from "@/lib/navLinks";

const MobileNav = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const setIntendedRoute = useAuthStore((state) => state.setIntendedRoute);
	const isLoadingAuth = useAuthStore((state) => state.isLoading);

	const cart = useCartStore((state) => state.cart);
	const isLoadingCart = useCartStore((state) => state.isLoading);

	const [open, setOpen] = useState(false);
	const [cartSize, setCartSize] = useState(0);

	const [activeLink, setActiveLink] = useState("home");

	useEffect(() => {
		const segment = pathname.split("/").filter(Boolean);
		setActiveLink(segment[0] ?? "home");
	}, [pathname]);

	useEffect(() => {
		setCartSize(cart?.items.length ?? 0);
	}, [cart]);

	const navigateToLogin = () => {
		setIntendedRoute(pathname); // Save where they came from
		navigate("/auth/login");
	};

	const handleLogout = async () => {
		const response = await logout();

		if (response.success) {
			toast.success(response.message);

			useCartStore.getState().clearLocalStorage();
			useCustomPizzaStore.getState().clearLocalStorage();
		} else {
			toast.error(response.message);
		}
	};

	return (
		<div className="flex justify-center items-center gap-4">
			<Link to="/cart" className="relative">
				{isLoadingCart ? (
					<Loader className="w-6 h-6 animate-spin mx-auto" />
				) : (
					<>
						<ShoppingCartIcon className="hover:text-secondary-foreground size-6" />
						{cartSize > 0 && (
							<Badge className="absolute -top-4 -right-4 h-5 min-w-5 p-1 rounded-full">
								{cartSize}
							</Badge>
						)}
					</>
				)}
			</Link>
			<button
				className="md:hidden p-2 flex flex-col gap-1"
				onClick={() => setOpen(!open)}
				aria-label="Toggle Menu"
			>
				<span className="w-8 h-[2px] bg-foreground origin-left animate-pulse" />
				<span className="w-8 h-[2px] bg-foreground origin-left animate-pulse delay-100" />
				<span className="w-8 h-[2px] bg-foreground origin-left animate-pulse delay-200" />
			</button>

			<AnimatePresence>
				{open && (
					<>
						<motion.nav
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.3 }}
							className="fixed inset-y-0 left-0 w-[300px] bg-sidebar text-sidebar-foreground pt-6 z-100 flex flex-col gap-6"
						>
							<button
								className="absolute top-5 right-5 rounded-md transition-colors hover:bg-muted duration-200"
								onClick={() => setOpen(false)}
							>
								<X />
							</button>

							<Logo />

							<Separator />

							<div className="flex justify-start items-center px-6 gap-4">
								<Avatar className="size-12">
									<AvatarImage src={user?.profileImage} alt="User profile" />
									<AvatarFallback>
										{user?.username?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>

								{isAuthenticated ? (
									<div>
										<p className="text-sm tracking-wide font-medium font-sans">
											{user?.username}
										</p>
										<p className="text-xs tracking-wide text-muted-foreground">
											{user?.email}
										</p>
									</div>
								) : (
									<button onClick={navigateToLogin} className="navLink">
										Login
									</button>
								)}
							</div>

							<ul className="w-full flex flex-col">
								{navLinksMobile.map((item) => {
									const res = item.label
										.trim()
										.toLowerCase()
										.replace(/\s+/g, "-");

									return (
										<li
											key={item.label}
											className={`w-full ${
												res === activeLink
													? "bg-sidebar-accent text-accent-foreground"
													: ""
											} hover:bg-sidebar-accent hover:text-accent-foreground py-2 px-8 rounded-sm`}
										>
											<Link
												onClick={() => setOpen(false)}
												to={item.href}
												className="flex justify-start items-center gap-2 cursor-pointer"
											>
												<item.icon className="size-4" />
												<p className="text-xs tracking-wide font-medium">
													{item.label}
												</p>
											</Link>
										</li>
									);
								})}
								{isAuthenticated && (
									<button
										className="flex justify-start items-center gap-2 py-2 px-8 group cursor-pointer rounded-sm hover:bg-sidebar-accent"
										onClick={handleLogout}
										disabled={isLoadingAuth}
									>
										{isLoadingAuth ? (
											<Loader className="w-6 h-6 animate-spin" />
										) : (
											<LogOut className="size-4 group-hover:stroke-primary-foreground" />
										)}
										<p className="text-xs text-text tracking-wide font-medium group-hover:text-accent-foreground">
											Log Out
										</p>
									</button>
								)}
							</ul>

							<div className="mt-auto">
								<Separator />
								<div className="my-6 flex flex-col justify-center items-center gap-2">
									<a
										href="tel:+1 123 456 7890"
										className="flex justify-center items-center gap-2 text-xs hover:text-secondary-foreground transition-colors duration-300"
									>
										<Phone className="size-4" aria-hidden />
										<span>+1 123 456 7890</span>
									</a>

									<a
										href="mailto:service@crusto.com"
										className="flex justify-center items-center gap-2 text-xs hover:text-secondary-foreground transition-colors duration-300"
									>
										<Mail className="size-4" aria-hidden />
										<span>service@crusto.com</span>
									</a>
								</div>
							</div>
						</motion.nav>

						<motion.div
							className="fixed inset-0 bg-black/70 z-40"
							onClick={() => setOpen(false)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MobileNav;
