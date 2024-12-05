import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import streamifier from "streamifier";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle 'multipart/form-data'
  },
};

export async function POST(request) {
  console.log("called image upload"), request;
  try {
    // Parse the form data using the native formData() method
    const formData = await request.formData();

    // Extract the file from the form data; ensure the input field name is 'image'
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Read the file data into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds limit (5MB)" },
        { status: 400 }
      );
    }

    // Upload the image to Cloudinary using a stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "forms_uploads" }, // Optional: specify a folder
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      // Convert Buffer to Stream and pipe to Cloudinary
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Respond with the image URL
    return NextResponse.json(
      { imageUrl: uploadResult.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
