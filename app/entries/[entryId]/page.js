// app/entries/[entryId]/page.js

import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import Entry from "@/models/Entry";
import EditModalClient from "@/components/EditModalClient";
import serializeEntry from "@/lib/serializeEntry";
import DeleteComponent from "@/components/DeleteComponent";

import SingleViewMap from "@/components/SingleViewMap";

export default async function EntryPage({ params }) {
  const resolvedParams = await params;
  const { entryId } = resolvedParams;

  await dbConnect();

  const entry = await Entry.findById(entryId).lean();
  console.log(entry);

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

  const displayDate = entry.pictureDate
    ? new Date(entry.pictureDate).toLocaleString()
    : new Date(entry.date).toLocaleString();

  const googleMapsUrl =
    entry.latitude && entry.longitude
      ? `https://www.google.com/maps?q=${entry.latitude},${entry.longitude}`
      : null;

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
        <div className="flex">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {entry.title}
            </h1>
            {entry.locationName && (
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {entry.locationName}
              </h3>
            )}
            {/* Entry Metadata */}
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-6">
              <span>Date: {displayDate}</span>
            </div>
            {/* Entry Notes */}
            <p className="text-lg text-gray-700 mb-6 whitespace-pre-wrap">
              {entry.notes}
            </p>

            {/* Location Information */}
            {entry.latitude && entry.longitude && (
              <div className="text-gray-700 mb-6">
                <p>
                  Coordinates: {entry.latitude}, {entry.longitude}
                </p>
              </div>
            )}
          </div>
          {/* Entry Image */}
          {entry.imageUrl && (
            <div className="relative w-full h-96">
              <Image
                src={entry.imageUrl}
                alt={entry.title}
                layout="fill"
                className="rounded-md object-contain"
                placeholder="blur"
                blurDataURL="/placeholder.png"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Location Information */}
        {entry.latitude && entry.longitude && (
          <div className="text-gray-700 mt-4 mb-6">
            {/* Map Display */}
            <SingleViewMap
              latitude={entry.latitude}
              longitude={entry.longitude}
            />
          </div>
        )}

        {/* Edit and Delete Actions */}
        <div className="flex">
          <EditModalClient entry={serializeEntry(entry)} />
          <DeleteComponent
            entryId={serializeEntry(entry)._id}
            redirectAfterDelete="/"
          />
        </div>
      </div>
    </div>
  );
}
