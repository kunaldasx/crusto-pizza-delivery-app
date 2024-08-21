import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "sonner";

const App = () => {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="min-h-screen max-w-screen flex flex-col relative overflow-hidden">
			<RouterProvider router={router} />
			<Toaster
				position="top-right"
				richColors
				closeButton
				duration={5000}
				toastOptions={{
					classNames: {
						toast:
							"rounded-xl shadow-md bg-gray-800 text-black border border-green-500",
						title: "text-lg font-semibold",
						description: "text-sm text-gray-300",
						actionButton: "text-green-300 hover:underline text-sm",
						cancelButton: "text-destructive hover:underline text-sm",
					},
				}}
			/>
		</div>
	);
};

export default App;
