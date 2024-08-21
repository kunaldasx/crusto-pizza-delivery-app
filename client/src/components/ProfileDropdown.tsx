import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useCustomPizzaStore } from "@/store/useCustomPizzaStore";
import { toast } from "sonner";
import { navLinksSidebar } from "@/lib/navLinks";

const ProfileDropdown = () => {
	const navigate = useNavigate();

	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const isLoadingAuth = useAuthStore((state) => state.isLoading);

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-12 cursor-pointer">
					<AvatarImage src={user?.profileImage} alt="Profile image" />
					<AvatarFallback>
						{user?.username?.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="w-[300px] mr-4">
				<DropdownMenuLabel className="flex justify-start items-center gap-4 p-4">
					<Avatar className="size-12">
						<AvatarImage src={user?.profileImage} alt="User profile" />
						<AvatarFallback>
							{user?.username?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-lg tracking-wide font-semibold font-sans">
							{user?.username}
						</p>
						<p className="text-sm tracking-wide text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{navLinksSidebar
						.filter(
							(item) =>
								item.label.toLowerCase() !== "dashboard" ||
								user?.role === "admin"
						)
						.map((item) => (
							<DropdownMenuItem
								key={item.label}
								className="flex justify-start items-center gap-2 px-4 py-2 group cursor-pointer"
								onClick={() => navigate(item.href)}
							>
								<item.icon className="size-4 group-hover:stroke-primary-foreground" />
								<p className="text tracking-wide group-hover:text-accent-foreground">
									{item.label}
								</p>
							</DropdownMenuItem>
						))}

					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="flex justify-start items-center gap-2 px-4 py-2 group cursor-pointer"
						onClick={handleLogout}
						disabled={isLoadingAuth}
					>
						{isLoadingAuth ? (
							<Loader className="w-6 h-6 animate-spin" />
						) : (
							<LogOut className="size-4 group-hover:stroke-primary-foreground" />
						)}
						<p className="text tracking-wide group-hover:text-primary-foreground">
							Log Out
						</p>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileDropdown;
