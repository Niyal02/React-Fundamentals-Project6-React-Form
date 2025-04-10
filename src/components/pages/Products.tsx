import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AxiosError } from "axios";
import instance from "../../axios/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddProductDialogCmp from "../small components/AddProductDialogCmp";
import Table from "../table/Table";
import Image from "../image/Image";
import ProEditButton from "../button/productButton/ProEditButton";
import ProDeleteButton from "../button/productButton/ProDeleteButton";

type Product = {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
  category: {
    uuid: string;
    name: string;
  };
};

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.display({
    id: "s.n",
    header: () => <span className="flex items-center">S.N.</span>,
    cell: ({ row }) => row.index + 1,
  }),
  columnHelper.accessor("imageUrl", {
    cell: (info) => (
      <Image src={info.getValue()} alt={info.row.original.name} size="md" />
    ),
    header: () => <span className="flex items-center">Image</span>,
  }),

  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center">Product Name</span>,
  }),
  columnHelper.accessor("price", {
    id: "price",
    cell: (info) => (
      <span className="italic text-blue-600">{info.getValue() || 0}</span>
    ),
    header: () => <span className="flex items-center"> Price</span>,
  }),
  columnHelper.accessor("category", {
    cell: (info) => info.getValue().name,
    header: () => <span className="flex items-center">Category</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="flex items-center">Action</span>,
    cell: ({ row }) => {
      const itemId = row.original.uuid;
      const itemName = row.original.name;

      return (
        <div className="flex items-center gap-3">
          <ProEditButton
            itemId={itemId}
            itemName={itemName}
            itemPrice={row.original.price}
            itemImage={row.original.imageUrl}
            itemCategory={row.original.category.uuid}
            categories={categories} //  fetch
          />

          <ProDeleteButton itemId={itemId} itemName={itemName} />
        </div>
      );
    },
  }),
] as ColumnDef<Product>[];

export default function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  {
    /* Fetching categories */
  }

  const fetchCategories = async (): Promise<
    Array<{ uuid: string; name: string }>
  > => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      const response = await instance.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.categories || [];
    } catch (error) {
      console.error("Failed to fetch categories", error);
      throw error;
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  {
    /* Fetching Products */
  }
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No Authentication token found for fetching products.");
      }
      const response = await instance.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Failed to fetch products", error);
      throw error;
    }
  };

  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data = [], isPending: isInitialLoading } = query;
  const queryClient = useQueryClient();

  {
    /* Handle Add Products */
  }
  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      setError("Product name cannot be empty");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      await instance.post(
        "/products",
        {
          name: newProductName,
          price: parseFloat(newProductPrice),
          imageUrl: newProductImage,
          category: newProductCategory,
        },
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
      setNewProductName("");
      setNewProductPrice("");
      setNewProductImage("");
      setNewProductCategory("");
      setIsOpen(false);
    } catch (err) {
      console.log("Failed to create product", err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to create product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Add product Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
      {/* Add Product Dialog */}
      <AddProductDialogCmp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        newProductName={newProductName}
        onProductNameChange={setNewProductName}
        newProductPrice={newProductPrice}
        onProductPriceChange={setNewProductPrice}
        newProductImage={newProductImage}
        onProductImageChange={setNewProductImage}
        newProductCategory={newProductCategory}
        onProductCategoryChange={setNewProductCategory}
        onSubmit={handleAddProduct}
        isLoading={isLoading}
        error={error}
      />

      {/* Table Component */}
      <Table<Product>
        columns={columns}
        data={data}
        isLoading={isInitialLoading}
        categories={categories}
        pagination={{
          pageIndex: 0,
          pageSize: 5,
          canNextPage: true,
          canPreviousPage: true,
        }}
      />
    </div>
  );
}
