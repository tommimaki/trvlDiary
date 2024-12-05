"use client"; // Tarvitaan, koska käytämme lomakkeen tilaa

import { useState, useRef } from "react";
import Image from "next/image";

export default function AddEntryPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(""); // Clear any previous messages
    let uploadedImageUrl = "";
    let uploadedPublicId = "";

    if (image) {
      setIsSubmitting(true);
      try {
        //  Uploading Image to Server-Side API
        const formData = new FormData();
        formData.append("image", image);

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
        uploadedPublicId = uploadData.publicId;
        console.log("uploadedImageUrl in addentrypage", uploadedImageUrl);
        console.log("uploadedPublicUrl in addentrypage", uploadedPublicId);
        console.log("publicId in addentrypage", uploadedPublicId);
        setMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage(`Image Upload Error: ${error.message}`);
        setIsSubmitting(false);
        return; // Exit the function if image upload fails
      }
    }

    try {
      //  Form Data to MongoDB API with image url
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          notes,
          imageUrl: uploadedImageUrl,
          publicId: uploadedPublicId,
        }),
      });

      if (res.ok) {
        setMessage("Entry added successfully!");
        setTitle("");
        setNotes("");
        setImage(null);
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
      setImage(file);
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center">
      <h1>Add Entry</h1>
      <form
        className=" border border-red-200 flex flex-col p-4 h-60 justify-between items-start"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="title">Title:</label>
          <input
            className=" text-bold rounded-lg bg-slate-500"
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
            className=" text-bold rounded-lg bg-slate-500"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {image && (
          <div>
            <p>Image Preview:</p>
            <Image
              src={URL.createObjectURL(image)}
              width={300} // width mandatory
              height={200}
              alt="Selected Image"
            />
          </div>
        )}

        <button
          className="bg-green-800 p-2 rounded-lg font-bold "
          type="submit"
        >
          Add Entry
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
