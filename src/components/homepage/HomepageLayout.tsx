import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import instance from "../../axios/axios";
import { Link } from "react-router-dom";

type Category = {
  uuid: string;
  name: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await instance.get("/categories/all");
    return response.data.categories;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};

export default function HomepageLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const accessToken = localStorage.getItem("accessToken");

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8 items-center">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-700">
                🧑‍💻 Rex IT Solutions
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-orange-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link
              to="/cart"
              className="text-2xl text-orange-700 hover:text-orange-800"
            >
              <FiShoppingCart />
            </Link>

            {accessToken ? (
              <button
                onClick={handleLogin}
                className="px-3 py-1 rounded-md text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white"
              >
                Login
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded-md text-sm font-medium bg-orange-700 hover:bg-orange-600 text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-amber-800 p-4 text-white fixed h-full transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-56"
          }`}
        >
          <button
            className="mb-4 ml-1.5 text-xl"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>

          {isCategoriesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                onClick={() => setSelectedCategory(null)}
                className={`p-2 rounded cursor-pointer ${
                  !selectedCategory ? "bg-amber-700" : "hover:bg-amber-700"
                }`}
              >
                {!isCollapsed && "All Categories"}
              </div>
              {categories.map((category) => (
                <div
                  key={category.uuid}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedCategory === category.name
                      ? "bg-amber-700"
                      : "hover:bg-amber-700"
                  }`}
                >
                  {!isCollapsed && category.name}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-16 md:ml-56 p-4">
          <Outlet
            context={{
              searchTerm,
              setSearchTerm,
              selectedCategory,
              setSelectedCategory,
            }}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#c7bead] py-4 flex justify-center">
        <div className="text-black text-sm">
          Copyright © 2025 | Privacy Policy
        </div>
      </footer>
    </div>
  );
}
