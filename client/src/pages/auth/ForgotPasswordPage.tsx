import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import Input from "../../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	ForgotPasswordFormType,
	forgotPasswordSchema,
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
import { toast } from "sonner";
import { useState } from "react";

const ForgotPasswordPage = () => {
	const forgotPassword = useAuthStore((state) => state.forgotPassword);
	const isLoading = useAuthStore((state) => state.isLoading);

	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

	const form = useForm<ForgotPasswordFormType>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleForgotPassword = async (values: ForgotPasswordFormType) => {
		try {
			const response = await forgotPassword(values.email);
			if (response.success) {
				setIsSubmitSuccessful(true);
				toast.success(response.message);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Failed to reset");
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
			<div className="p-8">
				<h2 className="heading-2 text-center pt-4 pb-7">Forgot Password</h2>

				{!isSubmitSuccessful ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleForgotPassword)}
							className="flex flex-col justify-center gap-6"
						>
							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-300 mb-6 text-center leading-5">
											Enter your email address and we'll send you a link to
											reset your password.
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
									"Send Reset Link"
								)}
							</motion.button>
						</form>
					</Form>
				) : (
					<div className="text-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<Mail className="h-8 w-8 text-white" />
						</motion.div>
						<p className="text-gray-300 mb-6">
							If an account exists for {form.getValues("email")}, you will
							receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<Link
					to={"/auth/login"}
					className="text-sm text-secondary-foreground font-semibold hover:underline flex items-center"
				>
					<ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
				</Link>
			</div>
		</motion.div>
	);
};
export default ForgotPasswordPage;
