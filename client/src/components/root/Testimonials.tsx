import { useWindowSize } from "@/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import testimonials_bg from "../../assets/images/testimonials-bg.webp";
import testimonials_profile_1 from "../../assets/images/testimonials-avatar-1.webp";
import testimonials_profile_2 from "../../assets/images/testimonials-avatar-2.webp";
import testimonials_profile_3 from "../../assets/images/testimonials-avatar-3.webp";

const testimonials = [
	{
		text: "Efficient, high-quality service with consistently excellent food. A must-try for pizza lovers.",
		author: "Jordan L., Food Blogger",
		profile: testimonials_profile_1,
	},
	{
		text: "Hands down the best pizza in town. Always hot, always fast!",
		author: "Emily R.",
		profile: testimonials_profile_2,
	},
	{
		text: "I ordered on a rainy night, and not only did the food arrive warm and quick, but it tasted like it came straight out of a brick oven. Absolute comfort food.",
		author: " Liam S.",
		profile: testimonials_profile_3,
	},
];

const Testimonials = () => {
	const windowSize = useWindowSize();

	const [index, setIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const slideCount = testimonials.length;

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(windowSize.width < 640);
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

	return (
		<section className="w-full h-[200px] md:h-[400px] text-center">
			<div className="w-full h-full relative flex flex-col justify-center items-center gap-8 md:gap-20 text-center p-4 md:p-20">
				<AnimatePresence mode="wait">
					<motion.div
						key={index}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.5 }}
						className="w-[70%] flex flex-col justify-center items-center gap-2"
					>
						<Avatar className="size-10 md:size-20">
							<AvatarImage src={testimonials[index].profile} alt="profile" />
							<AvatarFallback>
								<User2 />
							</AvatarFallback>
						</Avatar>
						<p>{testimonials[index].author}</p>
						<p className="text">{testimonials[index].text}</p>
					</motion.div>
				</AnimatePresence>

				{/* Testimonials Background */}
				<img
					src={testimonials_bg}
					className="absolute inset-0 w-full h-full object-cover -z-10"
					alt="testimonials"
				/>

				{/* Pagination Dots */}
				<ul className="absolute bottom-2.5 sm:bottom-5 md:bottom-10 flex justify-center items-center gap-1 md:gap-2 cursor-pointer">
					{testimonials.map((_, i) => (
						<motion.li
							key={i}
							onClick={() => paginate(i)}
							className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
								i === index ? "bg-accent scale-125" : "bg-muted"
							}`}
						/>
					))}
				</ul>

				{/* Navigation */}
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
			</div>
		</section>
	);
};

export default Testimonials;
