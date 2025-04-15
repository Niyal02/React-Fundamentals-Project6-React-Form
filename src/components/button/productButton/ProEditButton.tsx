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
import axios, { AxiosError } from "axios";
import Image from "../../image/Image";
import { useCategories } from "../../../hooks/use-categories";

interface ProEditButtonProps {
  itemId: string;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemCategory: string;
  onEditSuccess?: () => void;
}

const ProEditButton = ({
  itemId,
  itemName,
  itemImage,
  itemPrice,
  itemCategory,
  onEditSuccess,
}: ProEditButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedName, setEditedName] = useState(itemName);
  const [editedImage, setEditedImage] = useState(itemImage);
  const [editedPrice, setEditedPrice] = useState(itemPrice.toString());
  const [editedCategory, setEditedCategory] = useState(itemCategory);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { categories } = useCategories();

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setError("");

      const response = await instance.post("/files/generate-upload-url");
      const cloudinaryUrl = response.data?.uploadUrl;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "default");

      const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = cloudinaryResponse?.data?.secure_url;
      console.log({ imageUrl });
      return imageUrl;
    } catch (error) {
      console.log("Failed to upload Image: ", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const imageUrl = await uploadImage(file);
      setEditedImage(imageUrl);
    } catch (err) {
      console.log("Failed to upload image", err);
      if (err instanceof AxiosError) {
        setError("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!editedName.trim()) {
      setError(` ${itemName} Name cannot be empty. Please enter a valid name.`);
      return;
    }

    if (!editedPrice || isNaN(parseFloat(editedPrice))) {
      setError("Please enter a vaild price");
      return;
    }

    if (!editedCategory) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await instance.patch(`/products/${itemId}`, {
        name: editedName,
        price: parseFloat(editedPrice),
        imageUrl: editedImage,
        category: editedCategory,
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product updated successfully!", {
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
      setError("Failed to update product. Please try again.");
      toast.error("Failed to update product", {
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
              Edit product
            </DialogTitle>
            <Description className="mt-2 text-gray-600">
              Update the name for the product
            </Description>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => {
                    setEditedName(e.target.value);
                    setError("");
                  }}
                  placeholder="Product name"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => {
                    setEditedPrice(e.target.value);
                    setError("");
                  }}
                  placeholder="Product price"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {editedImage && (
                    <Image src={editedImage} alt="Product preview" size="sm" />
                  )}
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                      {isUploading ? "Uploading..." : "Change Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editedCategory}
                  onChange={(e) => {
                    setEditedCategory(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.uuid} value={category.uuid}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                  setEditedName(itemName);
                  setEditedPrice(itemPrice.toString());
                  setEditedImage(itemImage);
                  setEditedCategory(itemCategory);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={
                  isLoading ||
                  isUploading ||
                  !editedName.trim() ||
                  !editedPrice ||
                  !editedCategory ||
                  (editedName === itemName &&
                    editedPrice === itemPrice.toString() &&
                    editedImage === itemImage &&
                    editedCategory === itemCategory)
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
