"use server";
import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
// app/api/entries/[entryId]/route.js

export async function GET(request, context) {
  const { entryId } = context.params;
  console.log(entryId);

  await dbConnect();
  try {
    const entry = await Entry.findById(entryId);
    console.log(entry);
    return entry;
  } catch (error) {
    {
      console.error("error fetching: ", error);
    }
  }
}

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
export async function PATCH(request, context) {
  const { entryId } = context.params;
  console.log("Updating entry with ID:", entryId);

  await dbConnect(); // Establish database connection

  try {
    // Parse the incoming JSON data
    const body = await request.json();
    const { title, notes, imageUrl, publicId } = body;

    // Find the existing entry
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    // If a new image is provided, delete the old one from Cloudinary
    if (imageUrl && publicId && entry.publicId) {
      try {
        const deleteResponse = await cloudinary.uploader.destroy(
          entry.publicId
        );
        console.log("Deleted old image from Cloudinary:", deleteResponse);
      } catch (deleteError) {
        console.error(
          `Error deleting old image from Cloudinary for entry ID ${entryId}:`,
          deleteError
        );
        return NextResponse.json(
          { error: "Failed to delete old image from Cloudinary." },
          { status: 500 }
        );
      }
    }

    // Update the entry's fields
    if (title) entry.title = title;
    if (notes) entry.notes = notes;
    if (imageUrl) entry.imageUrl = imageUrl;
    if (publicId) entry.publicId = publicId;
    entry.updatedAt = new Date();

    await entry.save();

    // Serialize the updated entry
    const serializedEntry = {
      _id: entry._id.toString(),
      title: entry.title,
      notes: entry.notes,
      imageUrl: entry.imageUrl || null,
      publicId: entry.publicId || null,
      createdAt: entry.createdAt ? entry.createdAt.toISOString() : null,
      updatedAt: entry.updatedAt ? entry.updatedAt.toISOString() : null,
    };

    console.log("Entry updated successfully:", serializedEntry);

    return NextResponse.json(serializedEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
