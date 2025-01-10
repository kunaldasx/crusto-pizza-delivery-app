import { motion, useScroll, useTransform } from "motion/react";
import StarDivider from "../widgets/StarDivider";
import { useRef } from "react";
import features_banner from "../../assets/images/features-banner-bg.png";
import delivery_boy from "../../assets/widgets/delivery-boy.svg";

const Features = () => {
	const containerVariants = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2, // delay between children
			},
		},
	};

	const childVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
	};

	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"], // When the element starts/ends entering the viewport
	});

	// Animation values based on scroll
	const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);

	return (
		<section
			ref={ref}
			className="w-full relative flex justify-center items-center overflow-hidden"
		>
			<div className="container w-full relative flex max-md:flex-col justify-center items-center text-center gap-6 md:gap-12 mx-14 my-8 md:my-20">
				<motion.div
					variants={containerVariants}
					initial="initial"
					whileInView="animate"
					viewport={{
						once: true,
						amount: 0.3,
					}}
					className="w-[320px] md:w-[625px] relative flex flex-col justify-center items-center gap-2 md:gap-4"
				>
					<motion.div
						className="relative flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">From our kitchen to your door</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						Moments That Matter, Delivered Right on Time
					</motion.h2>
					<motion.p variants={childVariants} className="text">
						From bustling city streets to cozy neighborhoods, our kitchens serve
						dishes rooted in tradition—crafted by families, inspired by
						heritage, and delivered with care.
					</motion.p>

					<motion.a variants={childVariants} href="#" className="btn-secondary">
						<span className="text">Read More</span>
					</motion.a>
				</motion.div>

				<div className="relative">
					<img
						src={features_banner}
						className="w-64 sm:w-72 md:w-[500px] object-cover"
						alt="Delivery Banner"
					/>

					<motion.img
						style={{ x }}
						src={delivery_boy}
						className="absolute inset-0 object-covert"
						alt="Delivery Banner"
					/>
				</div>
			</div>
		</section>
	);
};

export default Features;
