import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StarDivider from "../widgets/StarDivider";
import { useWindowSize } from "@/hooks/useWindowSize";
import hero_banner_1 from "../../assets/images/hero-banner-1.webp";
import hero_banner_2 from "../../assets/images/hero-banner-2.webp";
import hero_banner_3 from "../../assets/images/hero-banner-3.webp";
import custom_pizza from "../../assets/widgets/custom-pizza-icon.svg";
import { Link } from "react-router-dom";

const slides = [hero_banner_1, hero_banner_2, hero_banner_3];

const Hero = () => {
	const windowSize = useWindowSize();

	const [index, setIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const slideCount = slides.length;

	const [isMobile, setIsMobile] = useState(false);
	const [isMediumScreen, setIsMediumScreen] = useState(false);

	useEffect(() => {
		setIsMobile(windowSize.width < 640);
		setIsMediumScreen(windowSize.width > 768);
	}, [windowSize]);

	const startAutoPlay = () => {
		intervalRef.current = setInterval(() => {
			setIndex((prev) => (prev + 1) % slideCount);
		}, 7000);
	};

	const stopAutoPlay = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const resetAutoPlay = () => {
		stopAutoPlay();
		startAutoPlay();
	};

	const handleNext = () => {
		setIndex((prev) => (prev + 1) % slideCount);
		resetAutoPlay();
	};

	const handlePrev = () => {
		setIndex((prev) => (prev - 1 + slideCount) % slideCount);
		resetAutoPlay();
	};

	const paginate = (idx: number) => {
		setIndex(idx);
		resetAutoPlay();
	};

	useEffect(() => {
		startAutoPlay();
		return () => stopAutoPlay(); // Clean up on unmount
	}, []);

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
		<section className="relative h-[40vh] sm:h-[50vh] md:h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
			{/* Hero Slideshow */}
			<motion.ul className="absolute inset-0 w-full h-full -z-[10]">
				{slides.map((src, i) => (
					<motion.li
						key={i}
						initial={{ scale: 1 }}
						animate={{
							scale: i === index ? 1.1 : 1,
							zIndex: i === index ? -1 : -2,
						}}
						transition={{ duration: 7 }}
						className="absolute inset-0 w-full h-full bg-black bg-blend-darken"
					>
						<img
							src={src}
							alt={`slide-${i}`}
							className="w-full h-full object-cover"
						/>
					</motion.li>
				))}
			</motion.ul>

			{/* Hero Content */}
			<motion.div
				variants={containerVariants}
				initial="initial"
				animate="animate"
				className="container flex flex-col justify-center items-center gap-2 md:gap-4 mt-8 sm:mt-12 md:mt-20 px-2 md:px-8"
			>
				<motion.div
					className="flex flex-col justify-center items-center md:gap-2"
					variants={childVariants}
				>
					<p className="subtitle">Made with Love & Cheese</p>
					<StarDivider />
				</motion.div>

				<motion.h1
					className="text-2xl sm:text-4xl md:text-7xl lg:text-8xl text-heading font-bold"
					variants={childVariants}
				>
					The pizza you deserve
				</motion.h1>

				<motion.p className="text" variants={childVariants}>
					Order now and get a slice of happiness delivered in minutes.
				</motion.p>

				<motion.a
					whileTap={{ scale: 0.98 }}
					className="btn-secondary mt-2 sm:mt-4 md:mt-8"
					href="#menu"
					variants={childVariants}
				>
					<span>View Our Menu</span>
				</motion.a>
			</motion.div>

			{/* Hero Navigation */}
			{!isMobile && (
				<>
					<button
						onClick={handlePrev}
						aria-label="Previous Slide"
						className="absolute left-10 w-8 h-8 md:w-12 md:h-12 bg-secondary text-secondary-foreground flex justify-center items-center border-2 border-button-border transform rotate-45 hover:bg-accent hover:text-accent-foreground transition duration-300"
					>
						<ChevronLeft className="transform -rotate-45 h-5 w-5 md:w-8 md:h-8" />
					</button>

					<button
						onClick={handleNext}
						aria-label="Next Slide"
						className="absolute right-10 w-8 h-8 md:w-12 md:h-12 bg-secondary text-secondary-foreground flex justify-center items-center border-2 border-button-border transform rotate-45 hover:bg-accent hover:text-accent-foreground transition duration-300"
					>
						<ChevronRight className="transform -rotate-45 h-5 w-5 md:w-8 md:h-8" />
					</button>
				</>
			)}

			{/* Create a Custom Pizza Button */}
			{isMediumScreen && (
				<Link
					to="/custom-pizza?new=true"
					className="absolute bottom-10 right-10 w-40 h-40 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-primary-start to-primary-end text-primary-foreground p-2 rounded-full transition-all duration-300 hover:scale-[1.02] hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-8 hover:ring-offset-gray-900"
				>
					<img
						src={custom_pizza}
						className="w-16 object-cover"
						alt="Create a custom pizza"
					/>
					<span className="font-semibold tracking-wide text-sm">
						Create a Custom Pizza
					</span>
				</Link>
			)}

			{/* Pagination Dots */}
			<ul className="absolute bottom-2.5 sm:bottom-5 md:bottom-10 flex justify-center items-center gap-1 md:gap-2 cursor-pointer">
				{slides.map((_, i) => (
					<motion.li
						key={i}
						onClick={() => paginate(i)}
						className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
							i === index ? "bg-accent scale-125" : "bg-muted"
						}`}
					/>
				))}
			</ul>
		</section>
	);
};

export default Hero;
