import { Link } from "react-router-dom";
import logo from "../../assets/widgets/logo.svg";

const Logo = () => {
	return (
		<Link to="/" className="flex justify-center items-center gap-2">
			<img
				src={logo}
				className="w-10 sm:w-12 md:w-16 object-cover"
				alt="Grilli Logo"
			/>
			<div className="flex flex-col justify-center items-center">
				<h2 className="text-xl sm:text-2xl md:text-4xl italic font-bold font-serif text-heading leading-none uppercase">
					CRUSTO
				</h2>
				<p className="text-[8px] sm:text-[10px] md:text-sm font-bold text-subtitle tracking-wide">
					Delicious Pizza
				</p>
			</div>
		</Link>
	);
};

export default Logo;
