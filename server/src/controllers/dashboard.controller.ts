import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import { Activity } from "../models/activity.model.js";

const getAnalytics = async (req: Request, res: Response) => {
	try {
		const [totalUsers, totalOrders, revenueResult, recentActivity] =
			await Promise.all([
				User.countDocuments(),
				Order.countDocuments(),
				Order.aggregate([
					{
						$group: {
							_id: null,
							totalRevenue: { $sum: "$orderTotalPrice" },
						},
					},
				]),

				// Latest activity
				Activity.find().lean(),
			]);

		const totalRevenue = revenueResult[0]?.totalRevenue || 0;

		const analytics = {
			totalUsers,
			totalOrders,
			totalRevenue,
			recentActivity,
		};

		res.status(200).json({
			analytics,
			success: true,
			message: "Fetched dashboard analytics",
		});
	} catch (error) {
		console.log("Error in getAnalytics controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const addActivity = async (req: Request, res: Response) => {
	try {
		const activityData = req.body;

		// Create the new activity
		await Activity.create(activityData);

		// Check if we exceed the limit
		const count = await Activity.countDocuments();

		if (count > 5) {
			// Remove oldest documents to maintain limit of 5
			const excess = count - 5;
			const oldestDocs = await Activity.find()
				.sort({ timestamp: 1 })
				.limit(excess)
				.select("_id");

			const idsToRemove = oldestDocs.map((doc) => doc._id);
			await Activity.deleteMany({ _id: { $in: idsToRemove } });
		}

		res.status(200).json({
			success: true,
			message: "Activity saved",
		});
	} catch (error) {
		console.log("Error in addActivity controller", (error as Error).message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export default {
	getAnalytics,
	addActivity,
};
