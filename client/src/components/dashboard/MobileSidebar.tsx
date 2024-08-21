import { LogOut, X } from "lucide-react";
import Logo from "../widgets/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { navLinksDashboard } from "@/lib/navLinks";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MobileSideBar = ({
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
		<AnimatePresence>
			{sidebarOpen && (
				<>
					<motion.nav
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ duration: 0.3 }}
						className="fixed inset-y-0 left-0 w-[300px] bg-sidebar text-sidebar-foreground z-100 flex flex-col items-center"
					>
						{/* Sidebar Header */}
						<div className="w-full border-b flex items-center justify-between p-4">
							<div>
								<Logo />
							</div>
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-1 rounded-md hover:bg-gray-700 transition-colors hover:text-primary-foreground"
							>
								<X />
							</button>
						</div>

						{/* Navigation */}
						<ul className="flex-1 w-full space-y-2 mt-2">
							{navLinksDashboard.map((item, index) => (
								<li key={index}>
									<Link
										to={item.href}
										onClick={() => setSidebarOpen(false)}
										className={`flex justify-start px-8 py-4 items-center gap-2 rounded-lg ${
											item.label.toLowerCase() === activeLink
												? "bg-sidebar-accent"
												: ""
										} hover:bg-sidebar-accent transition-colors group`}
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
							className="max-w-fit py-2 px-6 my-2 border-2 rounded-lg transition-colors duration-200 hover:bg-destructive/60 hover:text-primary-foreground"
						>
							<span className="text-xs tracking-wide flex justify-center items-center gap-2">
								<LogOut size={20} />
								{sidebarOpen && "Exit Dashboard"}
							</span>
						</Link>

						{/* Sidebar Footer */}
						<div className="w-full border-t flex justify-start items-center gap-4 p-4">
							<Avatar className="size-10">
								<AvatarImage src={user?.profileImage} alt="User profile" />
								<AvatarFallback>
									{user?.username?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-sm font-semibold tracking-wide font-sans">
									{user?.username}
								</p>
								<p className="text-xs tracking-wide text-muted-foreground">
									{user?.email}
								</p>
							</div>
						</div>
					</motion.nav>

					<motion.div
						className="fixed inset-0 bg-black/70 z-40"
						onClick={() => setSidebarOpen(false)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
				</>
			)}
		</AnimatePresence>
	);
};

export default MobileSideBar;
