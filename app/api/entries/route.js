import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import { getLocationName } from "@/utils/geocoding";

import { convertDMSToDecimal } from "@/utils/coordinates";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  console.log("Received Body:", body); // Log the request body

  try {
    const { title, notes, imageUrl, publicId, metadata } = body;

    // Validate metadata
    if (!metadata) {
      return new Response(
        JSON.stringify({ error: "Metadata is missing or invalid." }),
        { status: 400 }
      );
    }

    // Extract and parse CreateDate
    const pictureDateRaw = metadata?.CreateDate; // e.g., '2022:10:18 22:14:14'
    let pictureDate = null;

    if (pictureDateRaw) {
      // Split and reconstruct the date
      const parts = pictureDateRaw.split(/[:\s]/); // Split by ":" and space
      if (parts.length === 6) {
        const [year, month, day, hour, minute, second] = parts.map(Number);
        // JavaScript's Date constructor: months are 0-indexed, so subtract 1 from the month
        pictureDate = new Date(year, month - 1, day, hour, minute, second);
      }

      // Validate the reconstructed date
      if (!pictureDate || isNaN(pictureDate.getTime())) {
        console.warn("Invalid picture date:", pictureDateRaw);
        pictureDate = null; // Fallback to null if parsing fails
      }
    }

    // Extract location data
    const latitude = metadata?.GPSLatitude
      ? convertDMSToDecimal(metadata.GPSLatitude, metadata.GPSLatitudeRef)
      : null;
    const longitude = metadata?.GPSLongitude
      ? convertDMSToDecimal(metadata.GPSLongitude, metadata.GPSLongitudeRef)
      : null;

    // Perform reverse geocoding to get location name
    const locationName =
      latitude && longitude
        ? await getLocationName(latitude, longitude)
        : "Unknown Location";

    // Create entry in database
    const newEntry = await Entry.create({
      title,
      notes,
      imageUrl,
      publicId,
      pictureDate,
      latitude,
      longitude,
      locationName,
    });

    return new Response(JSON.stringify(newEntry), { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return new Response(JSON.stringify({ error: "Error creating entry" }), {
      status: 400,
    });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  await dbConnect();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  try {
    // Fetch paginated data
    const entries = await Entry.find()
      .sort({ date: -1 }) // Sort by date, newest first
      .skip(skip) // Skip documents for pagination
      .limit(limit); // Limit the number of documents

    const totalEntries = await Entry.countDocuments(); // Count total entries
    const totalPages = Math.ceil(totalEntries / limit);

    return new Response(
      JSON.stringify({ entries, page, totalPages, totalEntries }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching paginated entries:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch entries." }), {
      status: 500,
    });
  }
}
