const RatingStars = ({ rating = 0, totalStars = 5 }) => {
	// Calculate the number of full, half, and empty stars
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className="flex items-center">
			{/* Full stars */}
			{[...Array(fullStars)].map((_, i) => (
				<svg
					key={`full-${i}`}
					className="w-5 h-5 text-secondary-foreground"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			))}

			{/* Half star */}
			{hasHalfStar && (
				<svg
					className="w-5 h-5 text-secondary-foreground"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<defs>
						<linearGradient id="halfStarGradient">
							<stop offset="50%" stopColor="currentColor" />
							<stop offset="50%" stopColor="#6b6f77" />
						</linearGradient>
					</defs>
					<path
						fill="url(#halfStarGradient)"
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					/>
				</svg>
			)}

			{/* Empty stars */}
			{[...Array(emptyStars)].map((_, i) => (
				<svg
					key={`empty-${i}`}
					className="w-5 h-5 text-muted"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			))}

			<span className="text-xs md:text-sm ml-2 text-muted-foreground">
				{rating.toFixed(1)}/5
			</span>
		</div>
	);
};

export default RatingStars;
