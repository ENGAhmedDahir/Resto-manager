import cloudinary from "../config/cloudinary.js";
import { CatchAsync } from "./CatchAsync.js";

/**
 * Upload an image buffer to Cloudinary
 */
export async function uploadToCloudinary(buffer, options = {}) {
  if (!buffer) throw new Error("No image buffer provided");

  const encodedImage = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  const uploadOptions = {
    resource_type: "image",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    ...options,
  };

  try {
    const result = await cloudinary.uploader.upload(
      encodedImage,
      uploadOptions
    );
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

export const addImageToDb = CatchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const result = await uploadToCloudinary(req.file.buffer);
  req.file.filename = result.secure_url;

  next();
});
