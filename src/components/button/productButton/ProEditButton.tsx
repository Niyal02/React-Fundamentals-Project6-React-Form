import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../../axios/axios";
import { useQueryClient } from "@tanstack/react-query";

interface ProEditButtonProps {
  itemId: string;
  itemName: string;
  onEditSuccess?: () => void;
}

const ProEditButton = ({
  itemId,
  itemName,
  onEditSuccess,
}: ProEditButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedName, setEditedName] = useState(itemName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleEdit = async () => {
    if (!editedName.trim()) {
      setError(` ${itemName} Name cannot be empty`);
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await instance.patch(
        `/products/${itemId}`,
        { name: editedName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Category updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (onEditSuccess) onEditSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      setError("Failed to update category. Please try again.");
      toast.error("Failed to update category", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Edit
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rotate-45 -mb-1"></span>
        </span>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Edit Category
            </DialogTitle>
            <Description className="mt-2 text-gray-600">
              Update the name for the category
            </Description>

            <div className="mt-4">
              <input
                type="text"
                value={editedName}
                onChange={(e) => {
                  setEditedName(e.target.value);
                  setError("");
                }}
                placeholder="Category name"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                  setEditedName(itemName);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={
                  !editedName.trim() || isLoading || editedName === itemName
                }
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ProEditButton;
