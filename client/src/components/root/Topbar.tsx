import { Diamond, Earth, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

const Topbar = ({
	topBarVariants,
	isAtTop,
}: {
	topBarVariants: {};
	isAtTop: boolean;
}) => {
	return (
		<motion.div
			variants={topBarVariants}
			animate={isAtTop ? "visible" : "hidden"}
			className="w-full flex justify-between items-center p-2 md:py-3 md:px-6 text-[10px] md:text-xs lg:text-sm border-b-2"
		>
			<div className="flex justify-start items-center gap-2 md:gap-5">
				<div className="flex justify-center items-center gap-1 md:gap-2">
					<Earth className="size-4 md:size-6" aria-hidden />
					<span>World-Wide Pizza Delivery</span>
				</div>
				<Diamond
					className="text-secondary-foreground size-2 md:size-3"
					aria-hidden
				/>
				<div>
					<span>Your slice is just a click away!</span>
				</div>
			</div>
			<div className="flex justify-start items-center gap-2 md:gap-5">
				<a
					href="tel:+1 123 456 7890"
					className="flex justify-center items-center gap-1 md:gap-2 hover:text-secondary-foreground transition-colors duration-300"
				>
					<Phone className="size-4 md:size-6" aria-hidden />
					<span>+1 123 456 7890</span>
				</a>
				<Diamond
					className="text-secondary-foreground size-2 md:size-3"
					aria-hidden
				/>
				<a
					href="mailto:service@crusto.com"
					className="flex justify-center items-center gap-1 md:gap-2 hover:text-secondary-foreground transition-colors duration-300"
				>
					<Mail className="size-4 md:size-6" aria-hidden />
					<span>service@crusto.com</span>
				</a>
			</div>
		</motion.div>
	);
};

export default Topbar;
