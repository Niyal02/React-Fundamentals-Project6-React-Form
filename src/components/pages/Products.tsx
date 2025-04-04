import {
  ColumnSort,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { AxiosError } from "axios";

import DeleteButton from "../button/DeleteButton";
import instance from "../../axios/axios";
import EditButton from "../button/EditButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddProductDialogCmp from "../small components/AddProductDialogCmp";

type Product = {
  uuid: string;
  name: string;
  // products: string;
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
          <EditButton itemId={itemId} itemName={itemName} />

          <DeleteButton itemId={itemId} itemName={itemName} />
        </div>
      );
    },
  }),
];

export default function Products() {
  const [sorting, setSorting] = React.useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 relative">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

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

      {/* Add Category Dialog */}
      <AddProductDialogCmp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        newProductName={newProductName}
        onProductNameChange={setNewProductName}
        newProductPrice={newProductPrice}
        onProductPriceChange={setNewProductPrice}
        newProductCategory={newProductCategory}
        onProductCategoryChange={setNewProductCategory}
        onSubmit={handleAddProduct}
        isLoading={isLoading}
        error={error}
      />

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="ml-2" size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isInitialLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  Loading Products...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No Products Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-2">Items per page</span>
          <select
            className="border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="flex items-center">
            <input
              min={1}
              max={table.getPageCount()}
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 p-2 rounded-md border border-gray-400 text-center"
            />
            <span className="ml-1">of {table.getPageCount()}</span>
          </span>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
