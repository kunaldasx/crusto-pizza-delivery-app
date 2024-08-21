import Hero from "@/components/root/Hero";
import Menu from "@/components/root/Menu";
import About from "@/components/root/About";
import Testimonials from "@/components/root/Testimonials";
import Features from "@/components/root/Features";
import SpecialDish from "@/components/root/SpecialDish";
import Discounts from "@/components/root/Discounts";
import SocialPosts from "@/components/root/SocialPosts";
import Services from "@/components/root/Services";
import Subscribe from "@/components/root/Subscribe";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
	const { hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const el = document.getElementById(hash.replace("#", ""));
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	}, [hash]);

	return (
		<>
			<Hero />
			<Services />
			<About />
			<Discounts />
			<Menu />
			<SpecialDish />
			<Features />
			<Testimonials />
			<SocialPosts />
			<Subscribe />
		</>
	);
};

export default HomePage;
