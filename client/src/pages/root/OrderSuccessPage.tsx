import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
	return (
		<section className="bg-section-background w-screen h-screen flex flex-col justify-center items-center gap-6">
			<div className="bg-popover flex flex-col justify-center items-center gap-6 border-2 rounded-xl p-4 sm:p-6 md:p-12">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
					className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto p-2 border-4 border-white"
				>
					<Check className="h-full w-full stroke-3 text-white" />
				</motion.div>

				<h2 className="heading-2">Thank you for your order!</h2>
				<p className="text">
					Your payment was successful, and your order is being prepared.
				</p>

				<Link to="/orders" className="btn-secondary">
					<span>View My Orders</span>
				</Link>
			</div>
		</section>
	);
};

export default OrderSuccessPage;
