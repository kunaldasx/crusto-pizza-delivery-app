import { Mail, Phone } from "lucide-react";
import Logo from "../widgets/Logo";
import { motion } from "motion/react";
import { useWindowSize } from "@/hooks/useWindowSize";
import footer_bg from "../../assets/images/footer-bg.png";
import delivery_boy from "../../assets/widgets/delivery-boy.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { legalLinks, navLinks, socialLinks } from "@/lib/navLinks";

const Footer = () => {
	const windowSize = useWindowSize();
	const [animateToX, setAnimateToX] = useState(0);

	useEffect(() => {
		// Calculate the distance to animate based on screen width
		// Subtracting the element width to ensure it stops at the edge
		const imageWidth = {
			xs: 56, // w-14 (14 * 4px)
			sm: 96, // w-24 (24 * 4px)
			md: 128, // w-32 (32 * 4px)
			lg: 160, // w-40 (40 * 4px)
		};

		// Determine which image width to use based on screen size
		let currentWidth = imageWidth.xs - 50;
		if (windowSize.width >= 1024) {
			currentWidth = imageWidth.lg - 100;
		} else if (windowSize.width >= 768) {
			currentWidth = imageWidth.md - 100;
		} else if (windowSize.width >= 640) {
			currentWidth = imageWidth.sm;
		}

		// Calculate animation endpoint to be exactly the right edge of the screen
		setAnimateToX(windowSize.width - currentWidth);
	}, [windowSize]);

	return (
		<footer className="flex flex-col justify-center items-center">
			<div className="w-full relative flex flex-col justify-between items-center border-b-2">
				<div className="container w-[80%] flex justify-between items-start flex-wrap text-start gap-4 mx-14 my-8 md:my-20">
					<div className="w-2xs flex flex-col justify-center items-start gap-4">
						<Logo />
						<p className="text">
							Our journey began with a love for real food and real connections.
							Today, we bring that same love to your table—fresh, flavorful, and
							always on time.
						</p>
					</div>
					<div className="flex flex-col justify-center items-start gap-6">
						{/* Contact Section */}
						<div className="flex flex-col justify-center items-start gap-2">
							<p className="heading-3">Contact</p>
							<ul className="flex flex-col justify-center items-start gap-2">
								<li>
									<a
										href="tel:+1 123 456 7890"
										className="flex justify-center items-center gap-1 md:gap-2 hover:text-secondary-foreground transition-colors duration-300"
									>
										<Phone className="size-4 md:size-5" aria-hidden />
										<span className="text-xs md:text-sm">+1 123 456 7890</span>
									</a>
								</li>
								<li>
									<a
										href="mailto:service@crusto.com"
										className="flex justify-center items-center gap-1 md:gap-2 hover:text-secondary-foreground transition-colors duration-300"
									>
										<Mail className="size-4 md:size-5" aria-hidden />
										<span className="text-xs md:text-sm">
											service@crusto.com
										</span>
									</a>
								</li>
							</ul>
						</div>

						{/* Socials */}
						<div className="flex flex-col justify-center items-start gap-2">
							<p className="heading-3">Socials</p>
							<ul className="flex justify-start items-center gap-2">
								{socialLinks.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											target="_blank"
											className={`w-12 h-12 bg-section-background flex justify-center items-center border-2 rounded-full transition duration-300 group ${link.hoverBg}`}
										>
											<link.icon />
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Site Links */}
					<div className="flex flex-col justify-center items-start gap-2">
						<p className="heading-3">Site</p>
						<ul className="flex flex-col justify-center items-start gap-2">
							{navLinks.map((link) => (
								<li key={link.label}>
									<Link to={link.href} className="navLink">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div className="flex flex-col justify-center items-start gap-2">
						<p className="heading-3">Legal</p>
						<ul className="flex flex-col justify-center items-start gap-2">
							{legalLinks.map((link) => (
								<li key={link.label}>
									<Link to={link.href} className="navLink">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<img
					src={footer_bg}
					className="absolute bottom-0 w-full object-cover -z-40 bg-blend-darken"
					alt=""
				/>

				<motion.img
					animate={{
						x: [-150, animateToX],
					}}
					transition={{
						x: {
							duration: 20,
							ease: "linear",
							repeat: Infinity,
							repeatType: "loop",
						},
					}}
					src={delivery_boy}
					className="w-14 sm:w-24 md:w-32 lg:w-40 absolute -bottom-1 left-0 object-cover -z-40 opacity-95 bg-blend-darken"
					alt=""
				/>
			</div>

			<div className="text-center p-2">
				<p className="text">
					© 2025 Crusto. All Rights Reserved | Crafted by Soul Society
				</p>
			</div>
		</footer>
	);
};

export default Footer;
