import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type InputPropsType = {
	icon: LucideIcon;
	type?: InputHTMLAttributes<HTMLInputElement>["type"];
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputPropsType>(
	({ icon: Icon, type = "text", ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		const isPassword = type === "password";
		const inputType = isPassword && showPassword ? "text" : type;

		return (
			<div className="relative">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<Icon className="size-5 text-secondary-foreground" />
				</div>

				<input
					ref={ref}
					type={inputType}
					{...props}
					className="w-full pl-10 pr-10 py-2 bg-input tracking-wide text-[10px] md:text-[12px] lg:text-[16px] rounded-lg border-2 focus:border-button-border focus:ring-2 focus:ring-primary-start focus:ring-offset-2 focus:ring-offset-gray-900 outline-none transition duration-200"
				/>

				{/* Eye toggle icon (only for password) */}
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-secondary-foreground"
					>
						{showPassword ? (
							<EyeOff className="size-5" />
						) : (
							<Eye className="size-5" />
						)}
					</button>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";
export default Input;
