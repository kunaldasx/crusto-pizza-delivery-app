export function generateTimestamp() {
	const now = new Date();

	// Date: August 15, 2025
	const date = now.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Time: 4:56 PM
	const time = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return { date, time };
}
