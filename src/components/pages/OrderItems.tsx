// import {
//   ColumnDef,
//   ColumnSort,
//   createColumnHelper,
// } from "@tanstack/react-table";
// import { useState } from "react";
// import Table from "../table/Table";
// import { useQuery } from "@tanstack/react-query";
// import instance from "../../axios/axios";
// import Image from "../image/Image";

// type Order = {
//   SN: number;
//   image: string;
//   customer: string;
//   price: string;
//   name: string;
//   status: "PENDING" | "COMPLETED";
// };

// const columnHelper = createColumnHelper<Order>();

// const columns: ColumnDef<Order>[] = [
//   columnHelper.display({
//     id: "s.n",
//     header: () => <span className="flex items-center">S.N.</span>,
//     cell: ({ row }) => row.index + 1,
//   }),

//   columnHelper.accessor("image", {
//     cell: (info) => (
//       <Image src={info.getValue()} alt={info.row.original.name} size="md" />
//     ),
//     header: () => <span className="flex items-center">Image</span>,
//   }),

//   columnHelper.accessor("customer", {
//     cell: (info) => info.getValue(),
//     header: () => <span className="flex items-center">Customer</span>,
//   }),

//   columnHelper.accessor("name", {
//     cell: (info) => info.getValue(),
//     header: () => <span className="flex items-center"> Product Name</span>,
//   }),

//   columnHelper.accessor("price", {
//     cell: (info) => (
//       <span className="italic text-blue-600">{info.getValue()}</span>
//     ),
//     header: () => <span className="flex items-center">Price</span>,
//   }),

//   columnHelper.accessor("status", {
//     cell: (info) => (
//       <span
//         className={`px-2 py-1 rounded-full text-xs ${
//           info.getValue() === "COMPLETED"
//             ? "bg-green-100 text-green-800"
//             : "bg-yellow-100 text-yellow-800"
//         }`}
//       >
//         {info.getValue()}
//       </span>
//     ),
//     header: () => <span className="flex items-center">Status</span>,
//   }),

//   columnHelper.display({
//     id: "Update",
//     header: () => <span className="flex items-center">Update</span>,
//     cell: ({ row }) => (
//       <button
//         onClick={() => handleUpdateStatus(row.original.SN)}
//         className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//       >
//         UPDATE
//       </button>
//     ),
//   }),
// ] as ColumnDef<Order>[];

// // Mock function to update status (replace with API call)
// const handleUpdateStatus = (SN: number) => {
//   console.log(`Updating status for order ${SN}`);
// };

// export default function OrderItems() {
//   const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [sorting, setSorting] = useState<ColumnSort[]>([]);

//   // Fetch orders (mock data for now)
//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("No token found");
//       const response = await instance.get("/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch orders", error);
//       throw error;
//     }
//   };

//   const { data = [], isLoading } = useQuery({
//     queryKey: ["orders", filter],
//     queryFn: fetchOrders,
//   });

//   // Filter orders based on selection
//   const filteredOrders = data.filter((order: Order) =>
//     filter === "ALL" ? true : order.status === filter
//   );

//   return (
//     <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       {/* Filter Toggle */}
//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={() => setFilter("ALL")}
//           className={`px-4 py-2 rounded-md ${
//             filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           All
//         </button>
//         <button
//           onClick={() => setFilter("PENDING")}
//           className={`px-4 py-2 rounded-md ${
//             filter === "PENDING" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Pending
//         </button>
//         <button
//           onClick={() => setFilter("COMPLETED")}
//           className={`px-4 py-2 rounded-md ${
//             filter === "COMPLETED" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Completed
//         </button>
//       </div>

//       {/* Table Component */}
//       <Table<Order>
//         columns={columns}
//         data={filteredOrders}
//         isLoading={isLoading}
//         globalFilter={globalFilter}
//         setGlobalFilter={setGlobalFilter}
//         sorting={sorting}
//         setSorting={setSorting}
//       />
//     </div>
//   );
// }
