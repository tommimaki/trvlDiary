"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const EntriesListDisplay = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/entries");
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return <p>loading entries</p>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold">Diary Entries</h1>
      {entries.length === 0 ? (
        <p>No entries found</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry._id} className="border p-4 bg-slate-700 rounded-lg">
              {entry.imageUrl && (
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  width={300} // Specify the desired width
                  height={200}
                  className="w-full h-auto max-w-sm rounded-md object-cover"
                />
              )}
              <h2 className="text-xl text-white font-semibold">
                {entry.title}
              </h2>
              <p className="text-white">{entry.notes}</p>
              <p className="text-sm text-white">
                {new Date(entry.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntriesListDisplay;
