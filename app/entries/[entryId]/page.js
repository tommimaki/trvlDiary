import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";

export default async function EntryPage({ params }) {
  const { entryId } = params;

  await dbConnect();

  const entry = await Entry.findById(entryId).lean();

  if (!entry) {
    return (
      <div className="p-6 bg-gray-600 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Entry not found.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      {entry.imageUrl && (
        <Image
          src={entry.imageUrl}
          alt={entry.title}
          width={600}
          height={400}
          className="rounded mb-4"
        />
      )}
      <p className="text-lg">{entry.notes}</p>
      {/* Add more details or actions as needed */}
    </div>
  );
}
