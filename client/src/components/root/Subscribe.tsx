import { motion } from "motion/react";
import SubscribeForm from "../forms/SubscribeForm";
import shape_4 from "../../assets/widgets/shape-4.png";

const Subscribe = () => {
	return (
		<div className="w-full bg-section-background flex justify-center items-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true, amount: 0.3 }}
				className="max-w-3xl bg-popover relative flex flex-col justify-center items-start gap-4 md:gap-8 px-8 py-6 my-12 mx-8 border-2 rounded-2xl z-10"
			>
				<div className="flex flex-col justify-center items-start gap-2 md:gap-4">
					<h2 className="heading-2">Subscribe for Hot Pizza Deals and News</h2>
					<p className="text">Join the pizza party. Get exclusive 25% off 💫</p>
				</div>

				<SubscribeForm />

				{/* Floating Shapes */}
				<motion.div
					initial={{ y: 0 }}
					whileInView={{ y: ["10%", "-10%"] }}
					transition={{
						duration: 7,
						ease: "linear",
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="absolute -top-15 -right-10 md:-top-25 md:-right-25"
				>
					<img src={shape_4} className="w-28 md:w-40" aria-hidden />
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Subscribe;
