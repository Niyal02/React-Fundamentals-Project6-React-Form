import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiShoppingCart } from "react-icons/fi";
import axios from "../../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../productCard/ProductCard";
import ProductSidebar from "../productCard/ProductSidebar";

type Product = {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

const fetchProducts = async () => {
  const response = await axios.get("/products/all");
  return response.data;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  const filteredProducts = products.filter((product: Product) => {
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory) {
      return product.category === selectedCategory;
    }
    return true;
  });

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#dad5cb]">
      {/* Sidebar */}
      <ProductSidebar
        onSelectCategory={(catName: string) => {
          setSelectedCategory(catName);
          setSearchTerm(""); // clear search if category selected
        }}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col"
        style={{
          marginLeft: "14rem",
          width: "calc(100% - 14rem)",
        }}
      >
        {/* Navbar */}
        <nav className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold flex items-center gap-2"
          >
            <span className="text-orange-700">🧑‍💻 Rex IT Solutions</span>
          </Link>

          {/* Search and Login */}
          <div className="flex items-center space-x-4">
            {/* Search Field */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory(""); // clear category if search typed
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />

            {/* Cart Icon */}
            <div className="relative">
              <FiShoppingCart className="text-2xl text-orange-700 cursor-pointer" />
              {/* Add cart item count badge here if needed */}
            </div>

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
                className="px-3 py-1 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Search Result Box */}
        {searchTerm && (
          <div className="bg-white border border-gray-300 rounded-md p-4 m-4 max-h-96 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <div
                  key={product.uuid}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">{product.name}</h4>
                    <p className="text-xs text-orange-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!searchTerm && (
          <main className="flex-1 mx-auto py-6 sm:px-6 lg:px-8 pl-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <ProductCard>
                {filteredProducts.map((product: Product) => (
                  <motion.div
                    key={product.uuid}
                    whileHover={{ scale: 1.05 }}
                    className="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-80 transition duration-300"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-orange-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </ProductCard>
            )}
          </main>
        )}

        {/* Footer */}
        <footer className="bg-[#c7bead] py-4 mt-8 text-center text-black text-sm">
          Copyright © 2025 | Privacy Policy
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
