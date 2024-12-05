"use client"; // Tarvitaan, koska käytämme lomakkeen tilaa

import { useState, useRef } from "react";

export default function AddEntryPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(""); // Clear any previous messages

    let uploadedImageUrl = "";

    if (image) {
      setIsSubmitting(true);
      try {
        // **Step 1:** Upload Image to Server-Side API
        const formData = new FormData();
        formData.append("image", image); // Ensure the key matches the server-side expectation

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Image upload failed.");
        }

        const uploadData = await uploadResponse.json();
        console.log("uploadData in addentrypage", uploadData);
        uploadedImageUrl = uploadData.imageUrl;
        console.log("uploadedImageUrl in addentrypage", uploadedImageUrl);
        setMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage(`Image Upload Error: ${error.message}`);
        setIsSubmitting(false);
        return; // Exit the function if image upload fails
      }
    }

    try {
      // **Step 2:** Submit Form Data to MongoDB API
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, notes, imageUrl: uploadedImageUrl }),
      });

      if (res.ok) {
        setMessage("Entry added successfully!");
        setTitle("");
        setNotes("");
        setImage(null);
        setImageUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await res.json();
        setMessage(
          `Submission Error: ${errorData.error || "Failed to add entry."}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(`Submission Error: ${error.message || "An error occurred."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file type and size here
      setImage(file);
    }
  };

  return (
    <div className="bg-black">
      <h1>Add Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            className="text-black"
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
            className="text-black"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {/* Image Upload Field */}
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>

        {/* Image Preview */}
        {image && (
          <div>
            <p>Image Preview:</p>
            <img src={URL.createObjectURL(image)} alt="Selected Image" />
          </div>
        )}

        <button type="submit">Add Entry</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
