// components/EditModal.js

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function EditModal({ isOpen, onClose, entry, onUpdate }) {
  const [title, setTitle] = useState(entry.title);
  const [notes, setNotes] = useState(entry.notes);
  const [image, setImage] = useState(null); // New image file
  const [previewUrl, setPreviewUrl] = useState(entry.imageUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // form submission handling
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    let uploadedImageUrl = "";
    let uploadedPublicId = "";

    // If a new image is selected, we upload it first
    if (image) {
      try {
        // Uploading Image to Server-Side upload-image API
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

        uploadedImageUrl = uploadData.imageUrl;
        uploadedPublicId = uploadData.publicId;
        setMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(`Image Upload Error: ${error.message}`);
        setIsSubmitting(false);
        return; // Exit the function if image upload fails
      }
    }

    try {
      // Preparing the data for PATCH request
      const patchData = {
        title,
        notes,
      };
      //pathing image publicId and url
      if (uploadedImageUrl && uploadedPublicId) {
        patchData.imageUrl = uploadedImageUrl;
        patchData.publicId = uploadedPublicId;
      }

      // Sending PATCH request to update the entry
      const res = await fetch(`/api/entries/${entry._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchData),
      });

      if (res.ok) {
        const updatedEntry = await res.json();
        setMessage("Entry updated successfully!");
        onUpdate(updatedEntry); // Update parent component's state with the new data
        setTitle("");
        setNotes("");
        setImage(null);
        setPreviewUrl(updatedEntry.imageUrl || "");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onClose(); // Close the modal
      } else {
        const errorData = await res.json();
        setError(
          `Submission Error: ${errorData.error || "Failed to update entry."}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(`Submission Error: ${error.message || "An error occurred."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, image]);

  // Close the modal on Escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 text-black block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter title"
            />
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes<span className="text-red-500">*</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="mt-1 text-black block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Enter your notes"
            ></textarea>
          </div>

          {/* Image Upload Field */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 text-black block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <Image
                src={previewUrl}
                width={200}
                height={150}
                alt="Selected Image"
                className="rounded-md object-cover"
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success Message */}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`${
                isSubmitting
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
