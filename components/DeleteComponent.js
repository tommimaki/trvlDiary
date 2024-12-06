"use client";

import { useRouter } from "next/navigation";

const DeleteComponent = ({ entryId, redirectAfterDelete = "/" }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/entries/${entryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Entry deleted successfully.");

        // If a redirect is needed after deletion
        if (redirectAfterDelete) {
          router.push(redirectAfterDelete); // Redirect to the specified path
        }
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete
    </button>
  );
};

export default DeleteComponent;
