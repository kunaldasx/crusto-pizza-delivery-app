import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Logo from "../widgets/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { navLinksDashboard } from "@/lib/navLinks";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const user = useAuthStore((state) => state.user);

	const [activeLink, setActiveLink] = useState("home");
	const { pathname } = useLocation();

	useEffect(() => {
		const segment = pathname.split("/").filter(Boolean);
		setActiveLink(segment[1]?.toLowerCase() ?? "home");
	}, [pathname]);

	return (
		<div
			className={`${
				sidebarOpen ? "w-72" : "w-0 md:w-16"
			} transition-all duration-300 bg-sidebar text-sidebar-foreground flex flex-col justify-center items-center border-r`}
		>
			{/* Sidebar Header */}
			<div
				className={`w-full border-b flex items-center ${
					sidebarOpen ? "justify-between" : "justify-center"
				} p-4`}
			>
				<div className={`${sidebarOpen ? "block" : "hidden"} scale-75`}>
					<Logo />
				</div>
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="p-1 rounded-md hover:bg-gray-700 transition-colors hover:text-primary-foreground"
				>
					{sidebarOpen ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
				</button>
			</div>

			{/* Navigation */}
			<ul className="flex-1 w-full space-y-2 mt-2">
				{navLinksDashboard.map((item, index) => (
					<li key={index}>
						<Link
							to={item.href}
							className={`flex ${
								sidebarOpen ? "justify-start px-8 py-4" : "justify-center p-4"
							} ${
								item.label.toLowerCase() === activeLink
									? "bg-sidebar-accent"
									: ""
							} items-center gap-2 rounded-lg hover:bg-sidebar-accent transition-colors group`}
						>
							<item.icon
								size={20}
								className={`${
									item.label.toLowerCase() === activeLink.toLowerCase()
										? "text-sidebar-accent-foreground"
										: ""
								} group-hover:text-sidebar-accent-foreground`}
							/>
							<span
								className={`text tracking-wide ${
									sidebarOpen ? "block" : "hidden"
								} ${
									item.label.toLowerCase() === activeLink.toLowerCase()
										? "text-sidebar-accent-foreground"
										: ""
								} group-hover:text-sidebar-accent-foreground`}
							>
								{item.label}
							</span>
						</Link>
					</li>
				))}
			</ul>

			<Link
				to="/"
				className={`${
					sidebarOpen ? "py-2 px-6" : "p-2"
				} my-2 border-2 rounded-lg transition-colors duration-200 hover:bg-destructive/60 hover:text-primary-foreground`}
			>
				<span className="text-sm flex justify-center items-center gap-2">
					<LogOut size={20} />
					{sidebarOpen && "Exit Dashboard"}
				</span>
			</Link>

			{/* Sidebar Footer */}
			<div
				className={`w-full border-t flex ${
					sidebarOpen ? "justify-start" : "justify-center"
				} items-center gap-4 p-4`}
			>
				<Avatar className="size-10">
					<AvatarImage src={user?.profileImage} alt="User profile" />
					<AvatarFallback>
						{user?.username?.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className={`${sidebarOpen ? "block" : "hidden"}`}>
					<p className="text-[16px] font-semibold tracking-wide font-sans">
						{user?.username}
					</p>
					<p className="text-sm tracking-wide text-muted-foreground">
						{user?.email}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
