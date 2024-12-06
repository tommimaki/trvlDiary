"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteComponent from "./DeleteComponent";

const EntriesListDisplay = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Track if more entries are available
  const [isFetching, setIsFetching] = useState(false); // Avoid multiple fetches simultaneously

  const handleDeleteSuccess = (entryId) => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry._id !== entryId)
    );
  };

  const fetchEntries = async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    try {
      const res = await fetch(`/api/entries?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch entries");

      const data = await res.json();
      console.log("Fetched entries:", data);

      setEntries((prevEntries) => [...prevEntries, ...data.entries]); // Append new entries
      setHasMore(data.page < data.totalPages); // Check if more pages are available
      setPage((prevPage) => prevPage + 1); // Increment page for the next fetch
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  // Load initial entries
  useEffect(() => {
    fetchEntries();
  }, []);
  console.log("Entries:", entries);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 && // 100px threshold
        !isFetching
      ) {
        fetchEntries(); // Fetch more entries when near the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  if (loading) {
    return <p>Loading entries...</p>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold">Entries</h1>
      {entries.length === 0 ? (
        <p>No entries found</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className=" flex border p-4 bg-slate-700 rounded-lg"
            >
              <div className="flex-1 flex border border-red-200">
                {entry.imageUrl && (
                  <Image
                    src={entry.imageUrl}
                    alt={entry.title}
                    width={300}
                    height={200}
                    className="w-full h-auto max-w-sm rounded-md object-cover"
                  />
                )}
                <div className="flex flex-col p-4">
                  <Link
                    href={`/entries/${entry._id}`}
                    className="flex flex-col"
                  >
                    <h2 className="text-xl text-white font-semibold">
                      {entry.title}
                    </h2>
                    <p className="text-white">{entry.notes}</p>
                    <p className="text-sm text-white">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col border border-red-200">
                {/* <button
                  onClick={() => handleDelete(entry._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button> */}
                <DeleteComponent
                  entryId={entry._id}
                  onDeleteSuccess={() => handleDeleteSuccess(entry._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {isFetching && <p>Loading more entries...</p>}
      {!hasMore && <p className="text-center mt-4">No more entries to load.</p>}
    </div>
  );
};

export default EntriesListDisplay;
