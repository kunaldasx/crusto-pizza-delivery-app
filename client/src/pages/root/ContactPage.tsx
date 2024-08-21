import { socialLinks } from "@/lib/navLinks";
import { Mail, Phone } from "lucide-react";

const ContactPage = () => {
	return (
		<section className="w-screen min-h-screen bg-section-background pt-20 sm:pt-24 md:pt-40 pb-20 px-6 md:px-20 flex flex-col justify-start items-center gap-10">
			<h2 className="heading-2">Contact Us</h2>
			<div className="w-full md:w-3xl bg-popover border-2 rounded-xl p-4 md:p-6">
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
									<span className="text-xs md:text-sm">service@crusto.com</span>
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
			</div>
		</section>
	);
};

export default ContactPage;
