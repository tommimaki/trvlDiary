"use client";
import React, { useState, useEffect } from "react";

const EntriesListDisplay = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/entries");
        const data = await res.json();
        console.log("Fetched entries:", data);
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
