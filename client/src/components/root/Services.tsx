import { motion } from "motion/react";
import StarDivider from "../widgets/StarDivider";
import menu_banner from "../../assets/images/services-banner-1.webp";
import custom_pizza_banner from "../../assets/images/services-banner-2.webp";
import menu_icon from "../../assets/widgets/pizza-icon.svg";
import custom_pizza_icon from "../../assets/widgets/custom-pizza-icon.svg";

import shape1 from "../../assets/widgets/shape-1.png";
import shape2 from "../../assets/widgets/shape-2.png";
import { Link } from "react-router-dom";

const services = [
	{
		title: "View Our Menu",
		image: menu_banner,
		logo: menu_icon,
		link: "/#menu",
	},
	{
		title: "Create a Custom Pizza",
		image: custom_pizza_banner,
		logo: custom_pizza_icon,
		link: "/custom-pizza?new=true",
	},
];

const Services = () => {
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

	return (
		<section className="w-full flex justify-center items-center text-center relative overflow-hidden">
			<div className="container w-full flex flex-col justify-center items-center gap-6 md:gap-12 mx-14 my-8 md:my-20">
				<motion.div
					variants={containerVariants}
					initial="initial"
					whileInView="animate"
					viewport={{ amount: 0.3, once: true }}
					className="w-[320px] md:w-[625px] flex flex-col justify-center items-center gap-2 md:gap-4"
				>
					<motion.div
						className="flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">Crafted to Perfection</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						Artisan Pizza, Delivered Fast
					</motion.h2>
					<motion.p variants={childVariants} className="text">
						Every bite, a masterpiece. Curated ingredients, custom
						creations, and no compromises—brought straight to your
						door.
					</motion.p>
				</motion.div>

				<ul className="w-full flex justify-center items-center gap-4 md:gap-8">
					{services.map((item, idx) => (
						<motion.li
							initial={{
								opacity: 0,
								y: idx === 0 ? -50 : 50,
							}}
							whileInView={{
								opacity: 1,
								y: 0,
							}}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							key={idx}
						>
							<Link
								to={item.link}
								className="w-[150px] h-[200px] md:h-[400px] md:w-[300px] hover:text-secondary-foreground animated-card"
							>
								<img
									src={item.image}
									className="object-cover"
									alt="service-image"
								/>
								<div className="absolute bottom-0 w-full bg-popover/80 flex justify-center items-center gap-1 md:gap-2 py-2 px-auto overflow-hidden">
									<img
										src={item.logo}
										className="w-8 md:w-12"
										alt="service-logo"
									/>
									<h2 className="font-bold tracking-wide text-[10px] md:text-[12px] lg:text-[16px]">
										{item.title}
									</h2>
								</div>
							</Link>
						</motion.li>
					))}
				</ul>

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
					className="absolute bottom-0 left-0 -z-40"
				>
					<img
						src={shape1}
						className="w-28 md:w-40 lg:w-full"
						aria-hidden
					/>
				</motion.div>
				<motion.div
					initial={{ y: 0 }}
					whileInView={{ y: ["10%", "-10%"] }}
					transition={{
						duration: 7,
						ease: "linear",
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="absolute top-0 right-0 -z-40"
				>
					<img
						src={shape2}
						className="w-40 md:w-52 lg:w-full"
						aria-hidden
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default Services;
