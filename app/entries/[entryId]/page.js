// app/entries/[entryId]/page.js

import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import EditModalClient from "@/components/EditModalClient";
import serializeEntry from "@/lib/serializeEntry"; // Import the helper

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{serializedEntry.title}</h1>
      {serializedEntry.imageUrl && (
        <Image
          src={serializedEntry.imageUrl}
          alt={serializedEntry.title}
          width={600}
          height={400}
          className="rounded mb-4"
        />
      )}
      <p className="text-lg mb-6">{serializedEntry.notes}</p>
      {/* Embed the Client Component with serialized data */}
      <EditModalClient entry={serializedEntry} />
    </div>
  );
}
