// src/components/sidebar/Sidebar.tsx
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios/axios";

type Category = {
  id: number;
  name: string;
};

const ProductSidebar = ({
  onSelectCategory,
}: {
  onSelectCategory: (categoryName: string) => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/categories/all");
      return res.data;
    },
  });

  return (
    <div
      className={`bg-amber-800 h-screen p-4 text-white fixed transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <button
        className="mb-4 text-xl"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>

      <nav className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          categories.map((category: Category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className={`p-2 rounded cursor-pointer hover:bg-amber-700 transition-all ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {category.name}
            </div>
          ))
        )}
      </nav>
    </div>
  );
};

export default ProductSidebar;
