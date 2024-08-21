import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LoginFormType, loginSchema } from "@/schemas/auth.schema";

const LoginPage = () => {
	const navigate = useNavigate();

	const login = useAuthStore((state) => state.login);
	const intendedRoute = useAuthStore((state) => state.intendedRoute);
	const clearIntendedRoute = useAuthStore((state) => state.clearIntendedRoute);
	const isLoading = useAuthStore((state) => state.isLoading);

	const form = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = async (values: LoginFormType): Promise<void> => {
		try {
			const response = await login(values.email, values.password);

			if (response.success) {
				toast.success(response.message);
				navigate(intendedRoute || "/", { replace: true });
				clearIntendedRoute();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Login failed");
			console.log(error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
		>
			<div className="w-full p-8">
				<h2 className="heading-2 text-center pt-4 pb-7">Welcome Back</h2>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleLogin)}
						className="flex flex-col justify-center gap-6"
					>
						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="tracking-wide text-[10px] md:text-[12px] lg:text-[16px]">
										Email Address
									</FormLabel>
									<FormControl>
										<Input
											icon={Mail}
											type="email"
											placeholder="Email Address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											icon={Lock}
											type="password"
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center mb-6">
							<Link
								to="/auth/forgot-password"
								className="text-sm text-secondary-foreground font-semibold hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="btn-primary w-full"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader className="w-6 h-6 animate-spin mx-auto" />
							) : (
								"Login"
							)}
						</motion.button>
					</form>
				</Form>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Don't have an account?{" "}
					<Link
						to="/auth/signup"
						className="text-secondary-foreground font-semibold hover:underline"
					>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default LoginPage;
