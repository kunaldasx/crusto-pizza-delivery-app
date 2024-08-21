import special_dish_banner from "../../assets/images/special-dish-banner.webp";

const SpecialDish = () => {
	return (
		<section className="w-full">
			<div className="w-full flex flex-col justify-center items-center gap-2 md:gap-4 text-center relative overflow-hidden p-4 md:p-20">
				<h2 className="heading-2">Signature Special</h2>
				<p className="text">Crafted to impress your taste buds</p>
				<a href="#menu" className="btn-primary">
					Order Now
				</a>

				<img
					src={special_dish_banner}
					className="absolute inset-0 w-full object-cover -z-40"
					alt="special dish"
				/>
			</div>
		</section>
	);
};

export default SpecialDish;
