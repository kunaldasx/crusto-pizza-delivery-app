import { Loader, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "../ProfileDropdown";
import { navLinks } from "@/lib/navLinks";

const Navbar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const setIntendedRoute = useAuthStore((state) => state.setIntendedRoute);

	const cart = useCartStore((state) => state.cart);
	const isLoadingCart = useCartStore((state) => state.isLoading);
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

	return (
		<>
			<ul className="flex gap-6 justify-between items-center">
				{navLinks.map(({ href, label }) => {
					const res = label.trim().toLowerCase().replace(/\s+/g, "-");

					return (
						<li key={href}>
							<Link
								to={href}
								className={`navLink ${
									res === activeLink ? "text-secondary-foreground" : ""
								}`}
							>
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
			<div className="flex justify-end items-center gap-7">
				<Link to="/cart" className="relative">
					{isLoadingCart ? (
						<Loader className="w-6 h-6 animate-spin mx-auto" />
					) : (
						<>
							<ShoppingCartIcon className="hover:text-secondary-foreground size-7 md:size-8" />
							{cartSize > 0 && (
								<Badge className="absolute -top-4 -right-4 h-5 min-w-5 p-1 rounded-full">
									{cartSize}
								</Badge>
							)}
						</>
					)}
				</Link>

				{!isAuthenticated ? (
					<button onClick={navigateToLogin} className="navLink">
						Login
					</button>
				) : (
					<ProfileDropdown />
				)}
			</div>
		</>
	);
};

export default Navbar;
