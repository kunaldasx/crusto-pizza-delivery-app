import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import { Loader, Lock } from "lucide-react";
import { toast } from "sonner";
import PasswordStrengthMeter from "@/components/widgets/PasswordStrengthMeter";
import { useForm } from "react-hook-form";
import {
	ResetPasswordFormType,
	resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const ResetPasswordPage = () => {
	const resetPassword = useAuthStore((state) => state.resetPassword);
	const isLoading = useAuthStore((state) => state.isLoading);
	const { token } = useParams();
	const navigate = useNavigate();

	const form = useForm<ResetPasswordFormType>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const handleResetPassword = async (values: ResetPasswordFormType) => {
		try {
			if (!token) {
				return;
			}
			const response = await resetPassword(token, values.password);

			if (response.success) {
				toast.success(response.message);
				navigate("/auth/login");
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to reset password");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden my-12"
		>
			<div className="p-8">
				<h2 className="heading-2 text-center pt-4 pb-7">
					Reset Password
				</h2>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleResetPassword)}
						className="flex flex-col justify-center gap-6"
					>
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

						<PasswordStrengthMeter
							password={form.watch("password")}
						/>

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
								"Set New Password"
							)}
						</motion.button>
					</form>
				</Form>
			</div>
		</motion.div>
	);
};
export default ResetPasswordPage;
