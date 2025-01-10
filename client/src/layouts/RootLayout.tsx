import Header from "@/components/root/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { Outlet } from "react-router-dom";
import Footer from "@/components/root/Footer";
import BackToTop from "@/components/widgets/BackToTop";
import { usePizzaStore } from "@/store/usePizzaStore";
import { useEffect, useRef } from "react";
import { useCustomPizzaStore } from "@/store/useCustomPizzaStore";
import { useCartStore } from "@/store/useCartStore";
import LoadingOverlay from "@/components/widgets/LoadingOverlay";

const RootLayout = () => {
	const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);

	const syncCustomPizzas = useCustomPizzaStore(
		(state) => state.syncCustomPizzas
	);

	const syncCart = useCartStore((state) => state.syncCart);

	const getAllPizzas = usePizzaStore((state) => state.getAllPizzas);

	const isSyncingRef = useRef(false);

	useEffect(() => {
		getAllPizzas();
	}, []);

	useEffect(() => {
		if (isSyncingRef.current) return;

		(async () => {
			isSyncingRef.current = true;
			if (!isCheckingAuth && isAuthenticated && user) {
				await syncCustomPizzas(user._id);
				await syncCart(user._id);
			}
			isSyncingRef.current = false;
		})();
	}, [isAuthenticated, user]);

	return (
		<>
			<Header />
			<main className="flex-1 min-h-screen flex flex-col justify-center items-center">
				{isCheckingAuth ? <LoadingOverlay /> : <Outlet />}
			</main>
			<Footer />
			<BackToTop />
		</>
	);
};

export default RootLayout;
