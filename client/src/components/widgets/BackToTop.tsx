import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";

const BackToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const { scrollY } = useScroll();
	const threshold = 300;

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsVisible(latest > threshold);
	});

	// Scroll to top function
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
		});
	};

	return (
		isVisible && (
			<button
				onClick={scrollToTop}
				className="fixed bottom-6 right-6 p-3 bg-primary-end rounded-full shadow-lg hover:bg-primary-hover-end transition-all duration-300"
				aria-label="Back to top"
			>
				<ChevronUp />
			</button>
		)
	);
};

export default BackToTop;
