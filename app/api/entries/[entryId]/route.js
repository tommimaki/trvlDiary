import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export async function DELETE(request, { params }) {
  const { entryId } = params;

  await dbConnect(); // Establish database connection

  try {
    // Find the entry by ID
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    // Optional: Delete the associated image from Cloudinary
    if (entry.imageUrl) {
      // Extract the public ID from the imageUrl
      const publicId = entry.imageUrl.split("/").slice(-1)[0].split(".")[0]; // Assumes the URL ends with the public ID and extension

      await cloudinary.uploader.destroy(`forms_uploads/${publicId}`);
    }

    // Delete the entry from the database
    await Entry.findByIdAndDelete(entryId);

    return NextResponse.json(
      { message: "Entry deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { entryId } = params;

  await dbConnect(); // Establish database connection

  try {
    // Parse the incoming request's form data
    const formData = await request.formData();

    // Extract fields from form data
    const title = formData.get("title");
    const notes = formData.get("notes");
    const image = formData.get("image"); // Assuming 'image' is the name attribute

    // Find the existing entry
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    // Initialize an object to hold updated fields
    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (notes) updatedFields.notes = notes;

    // Handle image upload if a new image is provided
    if (image && image.size > 0) {
      // Optional: Delete the old image from Cloudinary
      if (entry.imageUrl) {
        const publicId = entry.imageUrl.split("/").slice(-1)[0].split(".")[0]; // Assumes the URL ends with the public ID and extension

        await cloudinary.uploader.destroy(`forms_uploads/${publicId}`);
      }

      // Upload the new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "forms_uploads" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(image).pipe(uploadStream);
      });

      // Update the imageUrl field
      updatedFields.imageUrl = uploadResult.secure_url;
    }

    // Update the entry in the database
    const updatedEntry = await Entry.findByIdAndUpdate(entryId, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
