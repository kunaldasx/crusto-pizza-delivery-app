import { motion } from "motion/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail } from "lucide-react";
import { subscribeFormType, subscribeSchema } from "@/schemas/subscribe.schema";

const SubscribeForm = () => {
	let isLoading = false;

	const form = useForm<subscribeFormType>({
		resolver: zodResolver(subscribeSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleSubscribe = async () => {};

	return (
		<Form {...form}>
			<form
				className="w-full flex flex-col justify-center items-start gap-4 lg:gap-6"
				onSubmit={form.handleSubmit(handleSubscribe)}
			>
				{/* Email */}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="w-full">
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
					className="btn-primary"
					type="submit"
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader className="w-6 h-6 animate-spin mx-auto" />
					) : (
						"Subscribe Now"
					)}
				</motion.button>
			</form>
		</Form>
	);
};

export default SubscribeForm;
