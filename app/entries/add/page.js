"use client"; // Tarvitaan, koska käytämme lomakkeen tilaa

import { useState } from "react";

export default function AddEntryPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, notes }),
      });

      if (res.ok) {
        setMessage("Entry added successfully!");
        setTitle(""); // Tyhjennä kentät
        setNotes("");
      } else {
        setMessage("Failed to add entry.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Add Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
