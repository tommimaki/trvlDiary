import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
// app/api/entries/[entryId]/route.js

export async function DELETE(request, context) {
  // Awaiting the 'params' object if necessary
  const params = await context.params;
  const { entryId } = params;
  console.log("Deleting entry with ID:", entryId);
  // console.log("context.params: ", context.params);

  await dbConnect(); // Establish database connection

  try {
    // Find the entry by ID
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    // Deleting the associated image from Cloudinary
    console.log("publicId before check", entry.publicId);
    if (entry.publicId) {
      try {
        const publicId = entry.publicId; // Directly from the entry
        console.log(
          `Attempting to delete image from Cloudinary with publicId: ${publicId}`
        );

        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion response:", deleteResponse);

        if (deleteResponse.result === "ok") {
          console.log(`Successfully deleted image with publicId: ${publicId}`);
        } else if (deleteResponse.result === "not found") {
          console.warn(
            `Image with publicId ${publicId} not found in Cloudinary.`
          );
        } else {
          console.warn(
            `Unexpected response from Cloudinary for publicId ${publicId}:`,
            deleteResponse
          );
        }
      } catch (imageError) {
        console.error(
          `Error deleting image from Cloudinary for entry ID ${entryId}:`,
          imageError
        );
        // Decide how to handle image deletion failures
        // For example, you might choose to proceed with deleting the entry or abort
      }
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
