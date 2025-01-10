import type { Request, Response, NextFunction } from "express";

export const processPizzaData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Define which fields should be arrays
		const arrayFields = ["cheese", "veggie", "extra"];

		// Process each array field
		arrayFields.forEach((field) => {
			const fieldValue = req.body[field];

			if (fieldValue) {
				if (Array.isArray(fieldValue)) {
					// Already an array, keep as is
					req.body[field] = fieldValue;
				} else {
					// Single value, convert to array
					req.body[field] = [fieldValue];
				}
			} else {
				// Field doesn't exist, set as empty array
				req.body[field] = [];
			}
		});

		// Ensure other fields are properly typed
		req.body.name = req.body.name || "";
		req.body.description = req.body.description || "";
		req.body.base = req.body.base || "";
		req.body.sauce = req.body.sauce || "";

		next();
	} catch (error) {
		console.error("Error processing pizza form data:", error);
		res.status(400).json({ error: "Invalid form data" });
	}
};
