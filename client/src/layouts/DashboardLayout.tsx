import Footer from "@/components/dashboard/Footer";
import Header from "@/components/dashboard/Header";
import MobileSideBar from "@/components/dashboard/MobileSidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import BackToTop from "@/components/widgets/BackToTop";
import LoadingOverlay from "@/components/widgets/LoadingOverlay";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

	const getAnalytics = useDashboardStore((state) => state.getAnalytics);

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const windowSize = useWindowSize();

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		setIsSmallScreen(windowSize.width < 768);
	}, [windowSize]);

	useEffect(() => {
		if (!isCheckingAuth && isAuthenticated && user?.role === "admin") {
			getAnalytics();
		}
	}, [isAuthenticated, user]);

	return (
		<div className="h-screen flex">
			{isSmallScreen ? (
				<MobileSideBar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
			) : (
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
			)}

			<div className="flex-1 flex flex-col">
				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main className="flex-1 w-full overflow-y-auto">
					{isCheckingAuth ? <LoadingOverlay /> : <Outlet />}
				</main>

				<Footer />
				<BackToTop />
			</div>
		</div>
	);
};

export default DashboardLayout;
