import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import instance from "../../axios/axios";
import { useState } from "react";
import { AxiosError } from "axios";

interface Category {
  uuid: string;
  name: string;
}

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newProductName: string;
  onProductNameChange: (name: string) => void;
  newProductPrice: string;
  onProductPriceChange: (price: string) => void;
  newProductImage: string;
  onProductImageChange: (image: string) => void;
  newProductCategory: string;
  onProductCategoryChange: (category: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  error: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await instance.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

const uploadImage = async (file: File): Promise<string> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await instance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.url;
  } catch (error) {
    console.log("Failed to upload Image: ", error);
    throw error;
  }
};

const AddProductDialogCmp = ({
  isOpen,
  onClose,
  newProductName,
  onProductNameChange,
  newProductPrice,
  onProductPriceChange,
  newProductImage,
  onProductImageChange,
  newProductCategory,
  onProductCategoryChange,
  onSubmit,
  isLoading,
  error,
}: AddProductDialogProps) => {
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    try {
      const imageUrl = await uploadImage(file);
      onProductImageChange(imageUrl);
    } catch (err) {
      console.log("Failed to upload image", err);
      if (err instanceof AxiosError) {
        setUploadError("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Add New Product
          </DialogTitle>
          <Description className="mt-2 text-gray-600">
            Fill the fields to add a new Product
          </Description>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => onProductNameChange(e.target.value)}
                placeholder="Enter product name"
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
                value={newProductPrice}
                onChange={(e) => onProductPriceChange(e.target.value)}
                placeholder="0.00"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="flex items-center gap-2 ">
                <label className=" cursor-pointer">
                  <span className="px-2 py-1.6 bg-gray-100 rounded-md hover:bg-gray-200 ">
                    {isUploading ? "Uploading" : "Choose File"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    // placeholder="Paste an image URL. Example: https://example.com/image.jpg"
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {newProductImage && !isUploading && (
                  <span className="">Image Selected</span>
                )}
              </div>

              {uploadError && (
                <p className="mt-1 text-sm text-red-600">{uploadError}</p>
              )}
              {newProductImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview</p>
                  <img
                    src={newProductImage}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newProductCategory}
                onChange={(e) => onProductCategoryChange(e.target.value)}
                disabled={isCategoriesLoading}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                } ${
                  isCategoriesLoading ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.uuid} value={category.uuid}>
                    {category.name}
                  </option>
                ))}
              </select>
              {isCategoriesLoading && (
                <p className="mt-1 text-sm text-gray-500">
                  Loading categories...
                </p>
              )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={
                !newProductName.trim() ||
                !newProductPrice ||
                !newProductCategory ||
                isLoading
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
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddProductDialogCmp;
