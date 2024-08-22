/* eslint-disable react-refresh/only-export-components */
import RootLayout from "@/layouts/RootLayout";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import HomePage from "@/pages/root/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import SignupPage from "@/pages/auth/SignupPage";
import { useAuthStore } from "@/store/useAuthStore";
import { ReactNode, useEffect, useRef } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/root/ProfilePage";
import CustomPizzaPage from "@/pages/root/CustomPizzaPage";
import CartPage from "@/pages/root/CartPage";
import OrderSuccessPage from "@/pages/root/OrderSuccessPage";
import OrdersPage from "@/pages/root/OrdersPage";
import OrderPage from "@/pages/root/OrderPage";
import DashOrdersPage from "@/pages/dashboard/OrdersPage";
import DashOrderPage from "@/pages/dashboard/OrderPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import IngredientsPage from "@/pages/dashboard/IngredientsPage";
import MenuPage from "@/pages/dashboard/MenuPage";
import DashHomePage from "@/pages/dashboard/HomePage";
import AboutPage from "@/pages/root/AboutPage";
import ContactPage from "@/pages/root/ContactPage";

// protect routes that require authentication
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const location = useLocation();

	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
	const setIntendedRoute = useAuthStore((state) => state.setIntendedRoute);

	const hasSavedRoute = useRef(false);

	useEffect(() => {
		if (hasCheckedAuth && !isAuthenticated && !hasSavedRoute.current) {
			setIntendedRoute(location.pathname);
			hasSavedRoute.current = true;
		}
	}, [hasCheckedAuth, isAuthenticated, location.pathname, setIntendedRoute]);

	if (hasCheckedAuth && !isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
	}

	if (hasCheckedAuth && !user?.isVerified) {
		return <Navigate to="/auth/verify-email" replace />;
	}

	return children;
};

const AdminRoute = ({ children }: { children: ReactNode }) => {
	const location = useLocation();

	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
	const setIntendedRoute = useAuthStore((state) => state.setIntendedRoute);

	const hasSavedRoute = useRef(false);

	useEffect(() => {
		if (hasCheckedAuth && !isAuthenticated && !hasSavedRoute.current) {
			setIntendedRoute(location.pathname);
			hasSavedRoute.current = true;
		}
	}, [hasCheckedAuth, isAuthenticated, location.pathname, setIntendedRoute]);

	// First check if auth has been verified
	if (!hasCheckedAuth) {
		return null; // or loading spinner
	}

	// Check authentication
	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
	}

	// Check email verification
	if (!user?.isVerified) {
		return <Navigate to="/auth/verify-email" replace />;
	}

	// Check admin role
	if (user?.role !== "admin") {
		return <Navigate to="/" replace />; // or wherever you want to redirect non-admins
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }: { children: ReactNode }) => {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);

	if (hasCheckedAuth && isAuthenticated && user?.isVerified) {
		return <Navigate to="/" replace />;
	}

	return children;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				),
			},
			{
				path: "custom-pizza",
				element: <CustomPizzaPage />,
			},
			{
				path: "cart",
				element: <CartPage />,
			},
			{
				path: "orders",
				element: (
					<ProtectedRoute>
						<OrdersPage />
					</ProtectedRoute>
				),
			},
			{
				path: "orders/:id",
				element: (
					<ProtectedRoute>
						<OrderPage />
					</ProtectedRoute>
				),
			},
			{
				path: "order-success",
				element: (
					<ProtectedRoute>
						<OrderSuccessPage />
					</ProtectedRoute>
				),
			},
			{
				path: "about",
				element: <AboutPage />,
			},
			{
				path: "contact",
				element: <ContactPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{
				path: "signup",
				element: (
					<RedirectAuthenticatedUser>
						<SignupPage />
					</RedirectAuthenticatedUser>
				),
			},
			{
				path: "login",
				element: (
					<RedirectAuthenticatedUser>
						<LoginPage />
					</RedirectAuthenticatedUser>
				),
			},
			{
				path: "verify-email",
				element: (
					<RedirectAuthenticatedUser>
						<EmailVerificationPage />
					</RedirectAuthenticatedUser>
				),
			},
			{
				path: "forgot-password",
				element: <ForgotPasswordPage />,
			},
			{
				path: "reset-password/:token",
				element: <ResetPasswordPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
	{
		path: "/dashboard",
		element: (
			<AdminRoute>
				<DashboardLayout />
			</AdminRoute>
		),
		children: [
			{
				index: true,
				element: <DashHomePage />,
			},
			{
				path: "orders",
				element: <DashOrdersPage />,
			},
			{
				path: "orders/:id",
				element: <DashOrderPage />,
			},
			{
				path: "ingredients",
				element: <IngredientsPage />,
			},
			{
				path: "menu",
				element: <MenuPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
