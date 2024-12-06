// app/entries/[entryId]/page.js

import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import EditModalClient from "@/components/EditModalClient";
import serializeEntry from "@/lib/serializeEntry";
import DeleteComponent from "@/components/DeleteComponent";

export default async function EntryPage({ params }) {
  const resolvedParams = await params;
  const { entryId } = resolvedParams;

  await dbConnect();

  const entry = await Entry.findById(entryId).lean();

  if (!entry) {
    return (
      <div className="p-6 bg-gray-600 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Entry not found.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const serializedEntry = serializeEntry(entry); // Serialize using the helper
  console.log(serializeEntry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-black flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg w-full max-w-3xl p-8">
        {/* Back Link */}
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-semibold mb-6 inline-block"
        >
          &larr; Back to Entries
        </Link>

        {/* Entry Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{entry.title}</h1>

        {/* Entry Image */}
        {entry.imageUrl && (
          <div className="relative w-full h-64 mb-6">
            <Image
              src={entry.imageUrl}
              alt={entry.title}
              layout="fill"
              className="rounded-md object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.png" // Optional: Placeholder image for better UX
            />
          </div>
        )}

        {/* Entry Notes */}
        <p className="text-lg text-gray-700 mb-6 whitespace-pre-wrap">
          {entry.notes}
        </p>

        {/* Entry Metadata */}
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-6">
          <span>Created At: {new Date(entry.date).toLocaleString()}</span>
        </div>

        {/* Edit Modal Client Component */}
        <EditModalClient entry={serializedEntry} />
        <DeleteComponent
          entryId={serializedEntry._id}
          redirectAfterDelete="/"
        />
      </div>
    </div>
  );
}
