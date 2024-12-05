import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";

// haetaan kaikki entryt
export async function GET(req) {
  await dbConnect(); //db connection

  try {
    const entries = await Entry.find(); //otetaan kaikki entryt
    return new Response(JSON.stringify(entries), { status: 200 }); // palautetaan stringifyed
  } catch (error) {
    return new Response(JSON.stringify({ error: "error fetching entries" }), {
      //error catchi
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
