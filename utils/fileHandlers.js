import streamifier from "streamifier";
import cloudinary from "@/utils/cloudinary";

/**
 * Extract metadata from an image hosted on Cloudinary.
 * @param {string} publicId - The public ID of the uploaded image on Cloudinary.
 * @returns {Object} Extracted metadata.
 */
export async function extractMetadataFromCloudinary(publicId) {
  console.log("Fetching metadata from Cloudinary...");
  try {
    const metadata = await cloudinary.api.resource(publicId, {
      image_metadata: true,
    });
    console.log("Extracted metadata:", metadata.image_metadata);
    return metadata.image_metadata;
  } catch (error) {
    console.error("Failed to extract metadata:", error.message);
    throw new Error("Metadata extraction failed");
  }
}
/**
 * Upload an image to Cloudinary.
 * @param {Buffer} buffer - The image buffer.
 * @returns {Object} Upload result from Cloudinary.
 */
export async function uploadToCloudinary(buffer) {
  console.log("Uploading image to Cloudinary...");
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "forms_uploads" },
      (error, result) => {
        if (result) {
          console.log("Image successfully uploaded to Cloudinary");
          resolve(result);
        } else {
          console.error("Cloudinary upload failed:", error.message);
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Gracefully shut down ExifTool when the server stops
process.on("exit", async () => {
  console.log("Shutting down ExifTool...");
  await exiftool.end();
});
