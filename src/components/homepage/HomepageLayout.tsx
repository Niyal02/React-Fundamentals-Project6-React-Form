import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import instance from "../../axios/axios";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

type Category = {
  uuid: string;
  name: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await instance.get("/categories/all");
    console.log(response.data);
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
    <div className="flex min-h-screen bg-[#dad5cb]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-700">
                🧑‍💻 Rex IT Solutions
              </span>
            </Link>
          </div>

          {/* Search + Cart + Login */}
          <div className="flex items-center gap-4">
            {/* Search field */}
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-orange-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-2xl text-orange-700 hover:text-orange-800"
            >
              <FiShoppingCart />
            </Link>

            {/* Login */}
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
                className="px-3 py-1 rounded-md text-sm font-medium bg-orange-700 hover:bg-orange-600 text-white cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Search Results */}
      {/* {searchTerm && (
        <div className="m-6 p-4 border border-gray-300 rounded bg-white">
          <h2 className="text-lg font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <div
                  key={product.uuid}
                  className="flex items-center gap-4 border p-2 rounded"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-orange-600 text-sm font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No matching products found.</p>
            )}
          </div>
        </div>
      )} */}

      {/* Sidebar */}
      <div
        className={`bg-amber-800 h-screen p-4 flex flex-col text-white fixed transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        <button
          className="mb-4 ml-1.5 text-xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        <nav className="flex flex-col gap-4">
          <div
            className={`relative flex items-center mt-4 p-2 rounded cursor-pointer transition-all duration-300 ${
              isCollapsed ? "justify-center" : "w-full"
            } hover:bg-amber-700 ${!selectedCategory ? "bg-amber-700" : ""}`}
          >
            {!isCollapsed && "All Categories"}
          </div>

          {isCategoriesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 "></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {categories.map((category: Category) => (
                <div
                  key={category.uuid}
                  onClick={() => {
                    setSelectedCategory(category.uuid);
                    navigate(`/home/category/${category.uuid}`);
                  }}
                  className={`relative flex items-center mt-4 p-2 rounded  transition-all duration-300 ${
                    isCollapsed ? "justify-center" : "w-full cursor-pointer"
                  } hover:bg-amber-700 ${
                    selectedCategory === category.uuid ? "bg-amber-700" : ""
                  }`}
                >
                  {!isCollapsed && category.name}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 ml-16 md:ml-56 p-4">
        <Outlet context={{ searchTerm, selectedCategory }} />
      </main>

      {/* Footer */}
      <footer className="bg-[#c7bead] py-4 mt-8 flex justify-center">
        <div className="text-black text-sm">
          Copyright © 2025 | Privacy Policy
        </div>
      </footer>
    </div>
  );
}
