import { useState, useEffect } from "react";

export const useWindowSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const updateSize = () =>
			setSize({ width: window.innerWidth, height: window.innerHeight });

		updateSize(); // Set initial size
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return size;
};
