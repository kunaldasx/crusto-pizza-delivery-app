import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { ActivityCategory } from "@/types/DashboardState";

const EmailVerificationPage = () => {
	const navigate = useNavigate();

	const verifyEmail = useAuthStore((state) => state.verifyEmail);
	const intendedRoute = useAuthStore((state) => state.intendedRoute);
	const clearIntendedRoute = useAuthStore(
		(state) => state.clearIntendedRoute
	);
	const isLoading = useAuthStore((state) => state.isLoading);

	const addActivity = useDashboardStore((state) => state.addActivity);

	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
	const formRef = useRef<HTMLFormElement>(null);

	// Auto focus on the first input field on load
	useEffect(() => {
		inputRefs.current[0]?.focus();
	}, []);

	const handleChange = (index: number, value: string) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				if (index + 1 < 6) {
					newCode[index + i] = pastedCode[i] || "";
				}
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex(
				(digit) => digit !== ""
			);
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex]?.focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleClear = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			const response = await verifyEmail(verificationCode);
			if (response.success) {
				const activity = {
					type: ActivityCategory.Signup,
					name: response.user?.username ?? "",
					timestamp: new Date(),
				};
				addActivity(activity);

				toast.success(response.message);
				navigate(intendedRoute || "/", { replace: true });
				clearIntendedRoute();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Email verification failed");
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			formRef.current?.requestSubmit();
		}
	}, [code]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=" bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-10 my-12"
		>
			<h2 className="heading-2 text-center pt-4 pb-7">
				Verify Your Email
			</h2>
			<p className="text-center text-gray-300 mb-6">
				Enter the 6-digit code sent to your email address.
			</p>

			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className="flex flex-col justify-center gap-6 space-y-6"
			>
				<div className="flex justify-between">
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							maxLength={6}
							value={digit}
							onChange={(e) =>
								handleChange(index, e.target.value)
							}
							onKeyDown={(e) => handleClear(index, e)}
							className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-xl focus:border-ring focus:outline-none "
							disabled={isLoading}
						/>
					))}
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
						"Verify Email"
					)}
				</motion.button>
			</form>
		</motion.div>
	);
};
export default EmailVerificationPage;
