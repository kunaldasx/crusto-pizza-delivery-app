import { motion } from "framer-motion";
import Input from "../../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/widgets/PasswordStrengthMeter";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SignupFormType, signupSchema } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const SignupPage = () => {
	const signup = useAuthStore((state) => state.signup);
	const isLoading = useAuthStore((state) => state.isLoading);
	const navigate = useNavigate();

	const form = useForm<SignupFormType>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSignup = async (values: SignupFormType) => {
		try {
			const response = await signup(
				values.email,
				values.password,
				values.username
			);

			if (response.success) {
				toast.success(response.message);
				navigate("/auth/verify-email");
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Signup failed");
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
				<h2 className="heading-2 text-center pt-4 pb-7">Create Account</h2>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignup)}
						className="flex flex-col justify-center gap-6"
					>
						{/* Username */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input icon={User} placeholder="Username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
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

						{/* Confirm Password */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											icon={Lock}
											type="password"
											placeholder="Confirm Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<PasswordStrengthMeter password={form.watch("password")} />

						{/* Submit Button */}
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
								"Sign Up"
							)}
						</motion.button>
					</form>
				</Form>
			</div>
			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<p className="text-sm text-gray-400">
					Already have an account?{" "}
					<Link
						to={"/auth/login"}
						className="text-secondary-foreground font-semibold hover:underline"
					>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default SignupPage;
