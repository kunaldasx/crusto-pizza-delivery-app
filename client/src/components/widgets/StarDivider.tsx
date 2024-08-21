const StarDivider = () => {
	return (
		<svg
			width="100"
			height="25"
			viewBox="0 0 100 25"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* <!-- Left line --> */}
			<line
				x1="0"
				y1="13.5"
				x2="25"
				y2="13.5"
				stroke="#fd5d61"
				strokeWidth="2"
			/>

			{/* <!-- Center stars --> */}
			<text x="50" y="20" fontSize="18" textAnchor="middle" fill="#fd5d61">
				⭑ ☆ ⭑
			</text>

			{/* <!-- Right line --> */}
			<line
				x1="75"
				y1="13.5"
				x2="100"
				y2="13.5"
				stroke="#fd5d61"
				strokeWidth="2"
			/>
		</svg>
	);
};

export default StarDivider;
