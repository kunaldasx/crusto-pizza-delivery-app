import { Activity } from "../models/activity.model";

export const addActivityHelper = async (activity: any) => {
	// Create the new activity
	await Activity.create(activity);

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
};
