import Github from "@/components/widgets/Github";
import Instagram from "@/components/widgets/Instagram";
import LinkedIn from "@/components/widgets/LinkedIn";
import Twitter from "@/components/widgets/Twitter";
import {
	Home,
	HomeIcon,
	Info,
	LayoutDashboard,
	Menu,
	Package,
	Phone,
	Pizza,
	ShoppingCartIcon,
	User2,
	Wheat,
} from "lucide-react";

export const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Menu", href: "/#menu" },
	{ label: "Custom Pizza", href: "/custom-pizza" },
	{ label: "About Us", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

export const navLinksSidebar = [
	{
		label: "Profile",
		href: "/profile",
		icon: User2,
	},
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		label: "Custom Pizza",
		href: "/custom-pizza",
		icon: Pizza,
	},
	{
		label: "Cart",
		href: "/cart",
		icon: ShoppingCartIcon,
	},
	{
		label: "Orders",
		href: "/orders",
		icon: Package,
	},
	{
		label: "About",
		href: "/about",
		icon: Info,
	},
	{
		label: "Contact",
		href: "/contact",
		icon: Phone,
	},
];

export const navLinksMobile = [
	{
		label: "Profile",
		href: "/profile",
		icon: User2,
	},
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		label: "Home",
		href: "/",
		icon: HomeIcon,
	},
	{
		label: "Menu",
		href: "/#menu",
		icon: Menu,
	},
	{
		label: "Custom Pizza",
		href: "/custom-pizza",
		icon: Pizza,
	},
	{
		label: "Cart",
		href: "/cart",
		icon: ShoppingCartIcon,
	},
	{
		label: "Orders",
		href: "/orders",
		icon: Package,
	},
	{
		label: "About",
		href: "/about",
		icon: Info,
	},
	{
		label: "Contact",
		href: "/contact",
		icon: Phone,
	},
];

export const legalLinks = [
	{
		label: "Terms of Service",
		href: "#",
	},
	{
		label: "Privacy Policy",
		href: "#",
	},
	{
		label: "Return &  Refund",
		href: "#",
	},
	{
		label: "Shipping Policy",
		href: "#",
	},
];

export const socialLinks = [
	{
		label: "Instagram",
		icon: Instagram,
		href: "",
		hoverBg: "hover:bg-instagram",
	},
	{
		label: "Twitter",
		icon: Twitter,
		href: "",
		hoverBg: "hover:bg-twitter",
	},
	{
		label: "LinkedIn",
		icon: LinkedIn,
		href: "",
		hoverBg: "hover:bg-linkedIn",
	},
	{
		label: "Github",
		icon: Github,
		href: "",
		hoverBg: "hover:bg-github",
	},
];

export const navLinksDashboard = [
	{
		label: "Home",
		href: "/dashboard",
		icon: Home,
	},
	{
		label: "Orders",
		href: "/dashboard/orders",
		icon: Package,
	},
	{
		label: "Ingredients",
		href: "/dashboard/ingredients",
		icon: Wheat,
	},
	{
		label: "Menu",
		href: "/dashboard/menu",
		icon: Menu,
	},
];
