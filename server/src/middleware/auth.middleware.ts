import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

interface JwtPayload {
	userId: string;
}

export const jwtCheck = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			res.status(401).json({ message: "Unauthorized - No Token Provided" });
			return;
		}

		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;

		if (!decodedToken) {
			res.status(401).json({ message: "Unauthorized - Invalid Token" });
			return;
		}

		const user = await User.findById(decodedToken.userId)
			.select("-password")
			.lean();

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in jwtCheck middleware", (error as Error).message);
		res.status(500).json({ message: "Internal server error" });
	}
};
