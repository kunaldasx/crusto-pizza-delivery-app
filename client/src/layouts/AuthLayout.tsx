import FloatingShape from "@/components/widgets/FloatingShape";
import LoadingSpinner from "@/components/widgets/LoadingOverlay";
import { useAuthStore } from "@/store/useAuthStore";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
	const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

	return (
		<main className="flex-1 flex items-center justify-center px-4">
			<FloatingShape
				color="bg-primary-start"
				size="w-64 h-64"
				top="-5%"
				left="10%"
				delay={0}
			/>
			<FloatingShape
				color="bg-primary-end"
				size="w-48 h-48"
				top="70%"
				left="80%"
				delay={5}
			/>
			<FloatingShape
				color="bg-primary-start"
				size="w-32 h-32"
				top="40%"
				left="-10%"
				delay={2}
			/>

			{isCheckingAuth ? <LoadingSpinner /> : <Outlet />}
		</main>
	);
};

export default AuthLayout;
