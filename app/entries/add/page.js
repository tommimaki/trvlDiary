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

    setMessage("");
    let uploadedImageUrl = "";
    let uploadedPublicId = "";
    let metadata = {};

    if (image) {
      setIsSubmitting(true);
      try {
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
        metadata = uploadData.metadata;

        setMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage(`Image Upload Error: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          notes,
          metadata,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Add Entry</h1>
      <form
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md p-6 space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title<span className="text-red-500">*</span>
          </label>
          <input
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter title"
          />
        </div>

        {/* Notes Field */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes<span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows={4}
            placeholder="Enter your notes"
          ></textarea>
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
          />
        </div>

        {/* Image Preview */}
        {image && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <Image
              src={URL.createObjectURL(image)}
              width={300}
              height={200}
              alt="Selected Image"
              className="rounded-md object-cover"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          type="submit"
        >
          Add Entry
        </button>
      </form>

      {/* Success Message */}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   setMessage(""); // Clear any previous messages
//   let uploadedImageUrl = "";
//   let uploadedPublicId = "";
//   let metadata = {};

//   if (image) {
//     setIsSubmitting(true);
//     try {
//       //  Uploading Image to Server-Side API
//       const formData = new FormData();
//       formData.append("image", image);

//       const uploadResponse = await fetch("/api/upload-image", {
//         method: "POST",
//         body: formData,
//       });

//       if (!uploadResponse.ok) {
//         const errorData = await uploadResponse.json();
//         throw new Error(errorData.error || "Image upload failed.");
//       }

//       const uploadData = await uploadResponse.json();

//       uploadedImageUrl = uploadData.imageUrl;
//       uploadedPublicId = uploadData.publicId;
//       metadata = uploadData.metadata;
//       setMessage("Image uploaded successfully.");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setMessage(`Image Upload Error: ${error.message}`);
//       setIsSubmitting(false);
//       return; // Exit the function if image upload fails
//     }
//   }

//   try {
//     //  Form Data to MongoDB API with image url
//     const res = await fetch("/api/entries", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         title,
//         notes,
//         imageUrl: uploadedImageUrl,
//         publicId: uploadedPublicId,
//         metadata,
//       }),
//     });

//     if (res.ok) {
//       setMessage("Entry added successfully!");
//       setTitle("");
//       setNotes("");
//       setImage(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } else {
//       const errorData = await res.json();
//       setMessage(
//         `Submission Error: ${errorData.error || "Failed to add entry."}`
//       );
//     }
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     setMessage(`Submission Error: ${error.message || "An error occurred."}`);
//   } finally {
//     setIsSubmitting(false);
//   }
// };
