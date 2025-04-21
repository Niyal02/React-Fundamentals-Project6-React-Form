// this is homepage containing search, sidebar only (no categories fetching api rn)

import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../productCard/ProductCard";
import { FiShoppingCart } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import instance from "../../axios/axios";

type Product = {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

const fetchProducts = async () => {
  try {
    const response = await instance.get("/products/all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};
const fetchCategories = async () => {
  try {
    const response = await instance.get("/categories/all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};

// Mock Categories data for Sidebar
// const categories = ["Electronics", "Books", "Clothing", "Toys"];

const HomePage = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const { data: categories = [], isLoading2 } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const accessToken = localStorage.getItem("accessToken");

  const handleLogin = () => {
    navigate("/login");
  };

  // Filter products based on search term or selected category
  const filteredProducts = searchTerm
    ? products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory
    ? products.filter(
        (product: Product) => product.category === selectedCategory
      )
    : products;

  return (
    <div className="flex min-h-screen bg-[#dad5cb]">
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

        <div className="flex flex-col gap-1">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative flex items-center mt-4 p-2 rounded cursor-pointer transition-all duration-300 ${
                isCollapsed ? "justify-center" : "w-full"
              } hover:bg-amber-700`}
            >
              <span
                className={`${
                  isCollapsed
                    ? "opacity-0 absolute left-14 group-hover:opacity-100"
                    : ""
                }`}
              >
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col`}
        style={{
          marginLeft: isCollapsed ? "4rem" : "14rem",
          width: isCollapsed ? "calc(100% - 4rem)" : "calc(100% - 14rem)",
        }}
      >
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
        {searchTerm && (
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
        )}

        {/* Product Card component */}
        <main className="flex-1 py-6 sm:px-6 lg:px-8 pl-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <ProductCard>
              {products.map((product: Product) => (
                <motion.div
                  key={product.uuid}
                  whileHover={{ scale: 1.05 }}
                  className="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-[200px] aspect-square w-full object-cover object-center group-hover:opacity-80 transition duration-300"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-orange-600">
                    ${product.price.toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </ProductCard>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-[#c7bead] py-4 mt-8 flex justify-center">
          <div className="text-black text-sm">
            Copyright © 2025 | Privacy Policy
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
