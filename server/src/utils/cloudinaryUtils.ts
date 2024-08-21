import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

export const uploadBufferToCloudinary = (
	buffer: Buffer,
	folder: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				public_id: uuidv4(),
			},
			(error, result) => {
				if (error) return reject(error);
				if (result?.secure_url) return resolve(result.secure_url);
				reject("No result from Cloudinary");
			}
		);

		Readable.from(buffer).pipe(stream);
	});
};

// Delete a single file by public_id
const deleteFromCloudinary = (publicId: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(publicId, (error, result) => {
			if (error) return reject(error);
			if (result?.result === "ok") return resolve();
			reject(`Failed to delete file: ${result?.result || "Unknown error"}`);
		});
	});
};

// Delete multiple files by public_ids
const deleteMultipleFromCloudinary = (publicIds: string[]): Promise<void> => {
	return new Promise((resolve, reject) => {
		cloudinary.api.delete_resources(publicIds, (error, result) => {
			if (error) return reject(error);
			if (result) return resolve();
			reject("Failed to delete files");
		});
	});
};

// Extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
	try {
		// Example URL: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/folder/filename.jpg
		const urlParts = url.split("/");
		const uploadIndex = urlParts.indexOf("upload");

		if (uploadIndex === -1) return null;

		// Get everything after version number (v1234567890)
		const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");

		// Remove file extension
		const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");

		return publicId;
	} catch (error) {
		return null;
	}
};

// Delete by URL
export const deleteFromCloudinaryByUrl = (url: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const publicId = extractPublicIdFromUrl(url);

		if (!publicId) {
			return reject("Invalid Cloudinary URL");
		}

		deleteFromCloudinary(publicId).then(resolve).catch(reject);
	});
};

// Delete multiple by URL
export const deleteMultipleFromCloudinaryByUrl = (
	urls: string[]
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const publicIds = urls
			.map((url) => extractPublicIdFromUrl(url))
			.filter((id): id is string => !!id); // Filter out undefined and keep type string[]

		if (!publicIds.length) {
			return reject("Invalid Cloudinary URL");
		}

		deleteMultipleFromCloudinary(publicIds).then(resolve).catch(reject);
	});
};
