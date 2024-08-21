import { motion } from "motion/react";
import StarDivider from "../widgets/StarDivider";
import discount_banner_1 from "../../assets/images/discounts-banner-1.webp";
import discount_banner_2 from "../../assets/images/discounts-banner-2.webp";
import discount_banner_3 from "../../assets/images/discounts-banner-3.webp";
import discount_banner_4 from "../../assets/images/discounts-banner-4.webp";
import shape_3 from "../../assets/widgets/shape-3.png";

const Discounts = () => {
	const containerVariants = {
		animate: {
			transition: {
				staggerChildren: 0.2, // delay between children
			},
		},
	};

	const childVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
	};

	return (
		<section className="w-full flex justify-center items-center relative overflow-hidden">
			<div className="container w-full flex flex-col justify-center items-center gap-6 md:gap-12 mx-14 my-8 md:my-20">
				<motion.div
					variants={containerVariants}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, amount: 0.5 }}
					className="w-[320px] md:w-[625px] flex flex-col justify-center items-center gap-2 md:gap-4"
				>
					<motion.div
						className="flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">Slice the Price</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						New discounts daily
					</motion.h2>
				</motion.div>

				<div className="w-full md:h-[400px] lg:h-[500px] grid grid-cols-2 md:grid-cols-4 grid-rows-4 gap-4 overflow-hidden">
					{/* Left large banner */}
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true, amount: 0.3 }}
						className="col-span-2 row-span-4 relative flex flex-col justify-center items-start gap-2 md:gap-4 p-6 rounded-2xl overflow-hidden group"
					>
						<h2 className="heading-2">
							50% Off Now!
							<br />
							Discount For Delicious
							<br />
							Tasty Pizzas!
						</h2>
						<p className="text">Sale off 50% only this week</p>
						<a href="#menu" className="btn-primary">
							Order Now
						</a>

						<img
							src={discount_banner_1}
							alt="Discount Banner"
							className="absolute inset-0 w-full h-full object-cover -z-20 transition-all duration-500 group-hover:scale-105"
						/>
					</motion.div>

					{/* Top-right pizza card */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true, amount: 0.3 }}
						className="row-span-2 relative flex flex-col justify-center items-start gap-2 md:gap-4 p-6 rounded-2xl overflow-hidden group"
					>
						<h2 className="heading-2">Delicious Pizza</h2>
						<p className="text">50% off Now</p>
						<img
							src={discount_banner_2}
							alt="Discount Banner"
							className="absolute inset-0 w-full h-full object-cover -z-20 transition-all duration-500 group-hover:scale-105"
						/>
					</motion.div>

					{/* Top-right Pizza card 2 */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true, amount: 0.3 }}
						className="row-span-2 relative flex flex-col justify-center items-start gap-2 md:gap-4 p-6 rounded-2xl overflow-hidden group"
					>
						<h2 className="heading-2">American Pizza</h2>
						<p className="text">25% off Now</p>
						<img
							src={discount_banner_3}
							alt="Discount Banner"
							className="absolute inset-0 w-full h-full object-cover -z-20 transition-all duration-500 group-hover:scale-105"
						/>
					</motion.div>

					{/* Bottom pizza card */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true, amount: 0.3 }}
						className="col-span-2 row-span-2 relative flex flex-col justify-center items-start gap-2 md:gap-4 p-6 rounded-2xl overflow-hidden group"
					>
						<h2 className="heading-2">Tasty Buzzed Pizza</h2>
						<p className="text">Sale off 50% only this week</p>
						<a href="#menu" className="btn-primary">
							Order Now
						</a>
						<img
							src={discount_banner_4}
							alt="Discount Banner"
							className="absolute inset-0 w-full h-full object-cover -z-20 transition-all duration-500 group-hover:scale-105"
						/>
					</motion.div>
				</div>

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
					className="absolute top-0 left-0 -z-40"
				>
					<img src={shape_3} className="w-60 md:w-96 lg:w-full" aria-hidden />
				</motion.div>
			</div>
		</section>
	);
};

export default Discounts;
