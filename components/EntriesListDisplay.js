"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteComponent from "./DeleteComponent";

const EntriesListDisplay = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

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
      setEntries((prevEntries) => {
        const uniqueEntries = data.entries.filter(
          (newEntry) =>
            !prevEntries.some((prevEntry) => prevEntry._id === newEntry._id)
        );
        return [...prevEntries, ...uniqueEntries];
      });

      setHasMore(data.page < data.totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isFetching
      ) {
        fetchEntries();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  if (loading) {
    return <p>Loading entries...</p>;
  }

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.pictureDate || a.date);
    const dateB = new Date(b.pictureDate || b.date);

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="w-full p-4">
      <div className="flex justify-end mb-4">
        <label className="text-white mr-2">Sort by:</label>
        <select
          className="p-2 text-black border rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>
      <h1 className="text-2xl font-bold">Entries</h1>
      {sortedEntries.length === 0 ? (
        <p>No entries found</p>
      ) : (
        <ul className="space-y-4">
          {sortedEntries.map((entry) => {
            const displayDate = entry.pictureDate
              ? new Date(entry.pictureDate).toLocaleDateString()
              : new Date(entry.date).toLocaleDateString();

            return (
              <li
                key={entry._id}
                className="flex border p-4 bg-slate-700 rounded-lg"
              >
                <div className="flex-1 flex">
                  {entry.imageUrl && (
                    <Image
                      src={entry.imageUrl}
                      alt={entry.title}
                      width={300}
                      height={200}
                      unoptimized
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
                      <p className="text-sm text-white">{displayDate}</p>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col p-2 border-l border-red-200">
                  <DeleteComponent
                    entryId={entry._id}
                    onDeleteSuccess={() => handleDeleteSuccess(entry._id)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {isFetching && <p>Loading more entries...</p>}
      {!hasMore && <p className="text-center mt-4">No more entries to load.</p>}
    </div>
  );
};

export default EntriesListDisplay;
