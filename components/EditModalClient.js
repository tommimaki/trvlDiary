// components/EditModalClient.js

"use client";

import React, { useState } from "react";
import EditModal from "./EditModal"; // Import the actual modal component

export default function EditModalClient({ entry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(entry);

  const handleUpdate = (updatedEntry) => {
    setCurrentEntry(updatedEntry);
    // Optionally, trigger a revalidation or state update here
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit Entry
      </button>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={currentEntry}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
