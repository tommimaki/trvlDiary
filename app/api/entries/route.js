import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";

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

//lisätään entry
export async function POST(req) {
  await dbConnect();
  const body = await req.json(); // Haetaan POST-data reqistä

  console.log(body, " reqbody in post /entries ");
  try {
    const newEntry = await Entry.create(body); // Luodaan uusi merkintä
    return new Response(JSON.stringify(newEntry), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating entry" }), {
      status: 400,
    });
  }
}
