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
  Edit,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { AxiosError } from "axios";
import {
  Dialog,
  Description,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import DeleteButton from "../button/DeleteButton";
import instance from "../../axios/axios";

type Category = {
  id: number;
  catname: string;
  products: string;
};

const columnHelper = createColumnHelper<Category>();

const columns = [
  columnHelper.display({
    id: "s.n",
    header: () => <span className="flex items-center">S.N.</span>,
    cell: ({ row }) => row.index + 1,
  }),
  columnHelper.accessor("catname", {
    cell: (info) => info.getValue(),
    header: () => <span className="flex items-center">Category Name</span>,
  }),
  columnHelper.accessor("products", {
    id: "products",
    cell: (info) => (
      <span className="italic text-blue-600">{info.getValue()}</span>
    ),
    header: () => <span className="flex items-center">Total products</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="flex items-center">Action</span>,
    cell: ({ row }) => {
      const itemId = row.original.id;
      const itemName = row.original.catname;

      return (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Edit size={18} />
            </button>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Edit
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rotate-45 -mb-1"></span>
            </span>
          </div>

          <DeleteButton itemId={itemId} itemName={itemName} />
        </div>
      );
    },
  }),
];

export default function Category() {
  const [data, setData] = React.useState<Category[]>([]);
  const [sorting, setSorting] = React.useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  {
    /* Fetching Categories */
  }
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error(
          "No Authorization token found for fetching categories."
        );
      }
      const response = await instance.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Failed to fetch categories", error);
      throw error;
    }
  };

  React.useEffect(() => {
    const loadCategories = async () => {
      setIsInitialLoading(true);
      try {
        const categories = await fetchCategories();
        setData(categories);
      } catch (error) {
        console.log("Error loading categories", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
  });

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

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Authorization token not found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await instance.post(
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
      const newCategory = {
        id: response.data.id,
        catname: response.data.name,
        products: response.data.products || "0",
      };
      setData((prev) => [newCategory, ...prev]);
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
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Add New Category
            </DialogTitle>
            <Description className="mt-2 text-gray-600">
              Enter the name for the new category
            </Description>

            <div className="mt-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
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
                  setIsAddDialogOpen(false);
                  setError("");
                }}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isLoading}
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
            {table.getRowModel().rows.length > 0 ? (
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
                  No Data Available
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
