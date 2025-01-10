import { useWindowSize } from "@/hooks/useWindowSize";
import { Menu } from "lucide-react";
import ProfileDropdown from "../ProfileDropdown";
import { useEffect, useState } from "react";
import Notification from "../Notification";

const Header = ({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const windowSize = useWindowSize();

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		setIsSmallScreen(windowSize.width < 768);
	}, [windowSize]);

	return (
		<header className="w-full bg-popover border-b flex justify-between items-center py-2  px-4 sm:px-6">
			<div className="flex items-center space-x-4">
				{isSmallScreen && (
					<button
						className="p-2 rounded-md hover:bg-gray-70"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						<Menu size={20} />
					</button>
				)}
				<h2 className="heading-2">Dashboard</h2>
			</div>

			<div className="flex items-center space-x-4">
				{/* Notifications */}
				<Notification />

				{/* User Menu */}
				<ProfileDropdown />
			</div>
		</header>
	);
};

export default Header;
