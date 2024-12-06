// lib/serializeEntry.js

export default function serializeEntry(entry) {
  return {
    _id: entry._id.toString(),
    title: entry.title,
    notes: entry.notes,
    imageUrl: entry.imageUrl || null,
    createdAt: entry.createdAt ? entry.createdAt.toISOString() : null,
  };
}
