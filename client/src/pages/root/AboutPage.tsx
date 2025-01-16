import { Phone } from "lucide-react";
import { motion } from "motion/react";
import about_banner_1 from "../../assets/images/about-banner-1.webp";
import about_banner_2 from "../../assets/images/about-banner-2.webp";
import about_badge from "../../assets/images/about-badge.png";
import about_badge_bg from "../../assets/images/about-badge-bg.png";
import StarDivider from "@/components/widgets/StarDivider";

const AboutPage = () => {
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

	const galleryVariants = {
		initial: {
			opacity: 0,
			x: 50,
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.8 },
		},
	};

	return (
		<section className="w-full flex justify-center items-center relative overflow-hidden">
			<div className="container w-full flex max-md:flex-col justify-center items-center text-center gap-12 mx-14 my-20 sm:my-32 md:my-52">
				<motion.div
					variants={containerVariants}
					initial="initial"
					whileInView="animate"
					viewport={{
						once: true,
						amount: 0.3,
					}}
					className="w-[320px] md:w-[625px] flex flex-col justify-center items-center gap-2 md:gap-4"
				>
					<motion.div
						className="flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">Our Story</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						Every Flavor Tells a Story
					</motion.h2>
					<motion.p variants={childVariants} className="text">
						What started as a small kitchen experiment fueled by a
						love for authentic Italian flavors has grown into a
						passionate journey of delivering happiness—one pizza at
						a time. At the heart of our story is a commitment to
						quality, creativity, and community. Every slice we serve
						is crafted with hand-picked ingredients, a perfected
						crust, and flavors that speak louder than words. Whether
						it’s a classic Margherita or a bold new creation, we
						believe every bite should tell a story worth sharing.
						Welcome to our table—where your cravings meet our craft.
					</motion.p>

					<motion.a
						variants={childVariants}
						href="tel:+1 123 456 7890"
						className="text-sm md:text-lg font-semibold flex justify-center items-center gap-2 transition-colors duration-300 hover:text-secondary-foreground"
					>
						<Phone />
						+1 123 456 7890
					</motion.a>
				</motion.div>

				<motion.div
					variants={galleryVariants}
					initial="initial"
					whileInView="animate"
					viewport={{
						once: true,
						amount: 0.3,
					}}
					className="relative"
				>
					<div className="gallery">
						<img
							src={about_banner_1}
							className="rounded-2xl object-cover"
							alt="About"
						/>
						<img
							src={about_banner_2}
							className="rounded-2xl object-cover"
							alt="About"
						/>
					</div>

					<img
						src={about_badge}
						className="absolute -top-10 -right-5 w-24 md:w-28"
						alt="badge"
					/>
					<img
						src={about_badge_bg}
						className="absolute -top-10 -right-5 w-24 md:w-28 animate-spin"
						style={{ animationDuration: "7s" }}
						alt="badge-bg"
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default AboutPage;
