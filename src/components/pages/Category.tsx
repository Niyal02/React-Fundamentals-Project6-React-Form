import React, { useState } from "react";
import { AxiosError } from "axios";

import DeleteButton from "../button/categoryButton/DeleteButton";
import instance from "../../axios/axios";
import AddCategoryDialogCmp from "../small components/AddCategoryDialogCmp";
import EditButton from "../button/categoryButton/EditButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import {
  ColumnDef,
  ColumnSort,
  createColumnHelper,
} from "@tanstack/react-table";
import Table from "../table/Table";

type Category = {
  uuid: string;
  name: string;
  products: string;
};

const columnHelper = createColumnHelper<Category>();

const columns: ColumnDef<Category>[] = [
  columnHelper.display({
    id: "s.n",
    header: () => <span className="flex items-center">S.N.</span>,
    cell: ({ row }) => row.index + 1,
  }),

  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center">Category Name</span>,
  }),
  columnHelper.accessor("products", {
    id: "products",
    cell: (info) => (
      <span className="italic text-blue-600">{info.getValue() || 0}</span>
    ),
    header: () => <span className="flex items-center">Total products</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="flex items-center">Action</span>,
    cell: ({ row }) => {
      const itemId = row.original.uuid;
      const itemName = row.original.name;

      return (
        <div className="flex items-center gap-3">
          <EditButton itemId={itemId} itemName={itemName} />

          <DeleteButton itemId={itemId} itemName={itemName} />
        </div>
      );
    },
  }),
] as ColumnDef<Category>[];

export default function Category() {
  // const [data, setData] = React.useState<Category[]>([]);
  const [sorting, setSorting] = React.useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  {
    /* Fetching Categories */
  }
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error(
          "No Authentication token found for fetching categories."
        );
      }
      const response = await instance.get("/categories");
      return response.data.categories;
    } catch (error) {
      console.log("Failed to fetch categories", error);
      throw error;
    }
  };

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data = [], isPending: isInitialLoading } = query;
  const queryClient = useQueryClient();

  // React.useEffect(() => {
  //   const loadCategories = async () => {
  //     setIsInitialLoading(true);
  //     try {
  //       const data = await fetchCategories();
  //       setData(data.categories);
  //     } catch (error) {
  //       console.log("Error loading categories", error);
  //     } finally {
  //       setIsInitialLoading(false);
  //     }
  //   };
  //   loadCategories();
  // }, []);
  // console.log({ data });

  {
    /* Handle Add Categories */
  }
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
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
        "/categories",
        {
          name: newCategoryName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const newCategory = {
      //   uuid: response.data.id,
      //   name: response.data.name,
      //   products: response.data.products || "0",
      // };
      // setData((prev) => [newCategory, ...prev]);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setNewCategoryName("");
      setIsAddDialogOpen(false);
    } catch (err) {
      console.log("Failed to create category", err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to create category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Add Category Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialogCmp
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setError("");
        }}
        newCategoryName={newCategoryName}
        onCategoryNameChange={(name) => {
          setNewCategoryName(name);
          setError("");
        }}
        onSubmit={handleAddCategory}
        isLoading={isLoading}
        error={error}
      />

      <Table<Category>
        data={data}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isInitialLoading}
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
