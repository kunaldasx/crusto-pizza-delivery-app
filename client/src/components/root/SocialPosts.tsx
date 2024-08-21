import { useWindowSize } from "@/hooks/useWindowSize";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StarDivider from "../widgets/StarDivider";
import { motion } from "motion/react";
import social_post_1 from "../../assets/images/social-post-1.webp";
import social_post_2 from "../../assets/images/social-post-2.webp";
import social_post_3 from "../../assets/images/social-post-3.webp";
import social_post_4 from "../../assets/images/social-post-4.webp";
import social_post_5 from "../../assets/images/social-post-5.webp";

const posts = [
	{
		src: social_post_1,
		url: "",
	},
	{
		src: social_post_2,
		url: "",
	},
	{
		src: social_post_3,
		url: "",
	},
	{
		src: social_post_4,
		url: "",
	},
	{
		src: social_post_5,
		url: "",
	},
];

const SocialPosts = () => {
	const windowSize = useWindowSize();

	const scrollRef = useRef<HTMLDivElement>(null);
	const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(windowSize.width < 640);
	}, [windowSize]);

	// Duplicate posts just enough for seamless looping
	const repeatCount = 3;
	const galleryItems = Array(repeatCount).fill(posts).flat();

	// Scroll handler for arrows
	const scroll = (direction: string) => {
		const container = scrollRef.current;
		if (!container) return;
		const scrollAmount = 300;
		container.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth",
		});
	};

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
		<section className="w-full bg-section-background flex flex-col justify-center items-center">
			<motion.div
				variants={containerVariants}
				initial="initial"
				whileInView="animate"
				viewport={{
					once: true,
					amount: 0.3,
				}}
				className="container w-full flex flex-col justify-center items-center text-center gap-6 md:gap-12 mx-14 my-8 md:my-20"
			>
				<div className="w-[320px] md:w-[625px] flex flex-col justify-center items-center gap-2 md:gap-4">
					<motion.div
						className="flex flex-col justify-center items-center md:gap-2"
						variants={childVariants}
					>
						<p className="subtitle">From Our Feed</p>
						<StarDivider />
					</motion.div>
					<motion.h2 variants={childVariants} className="heading-2">
						Fresh posts. Real moments. All in one place
					</motion.h2>
				</div>
				<motion.div variants={childVariants} className="w-full relative">
					<div
						ref={scrollRef}
						className="relative flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar touch-pan-x whitespace-nowrap mx-14 z-10"
					>
						{galleryItems.map((item, index) => (
							<div
								key={index}
								className="relative flex-shrink-0"
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(-1)}
							>
								<a
									href={item.socialUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="cursor-pointer"
								>
									<img
										src={item.src}
										loading="lazy"
										alt={`Gallery ${index}`}
										className={`h-52 md:h-64 w-auto object-cover rounded-2xl transition-all duration-300 ${
											hoveredIndex === index ? "opacity-30" : ""
										}`}
									/>
									{hoveredIndex === index && (
										<div className="absolute inset-0 flex items-center justify-center">
											<Eye className="w-10 h-10" />
										</div>
									)}
								</a>
							</div>
						))}
					</div>

					{!isMobile && (
						<div className="absolute inset-0 w-full flex justify-between items-center px-2">
							<button
								onClick={() => scroll("left")}
								aria-label="Previous Slide"
								className="hover:text-secondary-foreground transition duration-300"
							>
								<ChevronLeft className="h-12 w-12" />
							</button>
							<button
								onClick={() => scroll("right")}
								aria-label="Previous Slide"
								className="hover:text-secondary-foreground transition duration-300"
							>
								<ChevronRight className="h-12 w-12" />
							</button>
						</div>
					)}
				</motion.div>
			</motion.div>
		</section>
	);
};

export default SocialPosts;
