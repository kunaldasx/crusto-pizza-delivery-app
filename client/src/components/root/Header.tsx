import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Topbar from "./Topbar";
import { useWindowSize } from "@/hooks/useWindowSize";
import MobileNav from "./MobileNav";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Logo from "../widgets/Logo";

const Header = () => {
	const windowSize = useWindowSize();

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(windowSize.width < 640);
	}, [windowSize]);

	const { scrollY } = useScroll();
	const [isScrollingUp, setIsScrollingUp] = useState(false);
	const [isAtTop, setIsAtTop] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsAtTop(latest === 0);
		setIsScrollingUp(latest < lastScrollY);
		setLastScrollY(latest);
	});

	const headerVariants = {
		visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
		hidden: { y: "-100%", opacity: 0, transition: { duration: 0.5 } },
	};

	return (
		<header className="fixed top-0 w-full flex flex-col justify-center items-center z-50">
			{!isMobile && (
				<Topbar topBarVariants={headerVariants} isAtTop={isAtTop} />
			)}

			<motion.nav
				variants={headerVariants}
				animate={isAtTop || isScrollingUp ? "visible" : "hidden"}
				className={`w-full  flex justify-between items-center px-3 py-4 md:px-6 ${
					!isAtTop ? "bg-popover absolute top-0" : "bg-secondary"
				}`}
			>
				<Logo />
				{isMobile ? <MobileNav /> : <Navbar />}
			</motion.nav>
		</header>
	);
};

export default Header;
