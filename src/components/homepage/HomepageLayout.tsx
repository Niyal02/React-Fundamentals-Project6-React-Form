import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useCategories } from "../../hooks/use-categories";

type Category = {
  uuid: string;
  name: string;
};

const HomepageLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const accessToken = localStorage.getItem("accessToken");

  return (
    <div className="flex min-h-screen bg-[#dad5cb]">
      {/* Sidebar  */}
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

        {isCategoriesLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 "></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setSelectedCategory(null)}
              className={`relative flex items-center mt-4 p-2 rounded  transition-all duration-300 ${
                isCollapsed ? "justify-center" : "w-full"
              } hover:bg-amber-700 ${!selectedCategory ? "bg-amber-700" : ""}`}
            ></div>
            {categories.map((category: Category) => (
              <div
                key={category.uuid}
                onClick={() => {
                  setSelectedCategory(category.uuid);
                  navigate(`/home/category/${category.uuid}`);
                }}
                className={`relative flex items-center p-2 rounded  transition-all duration-300 ${
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
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col`}
        style={{
          marginLeft: isCollapsed ? "4rem" : "14rem",
          width: isCollapsed ? "calc(100% - 4rem)" : "calc(100% - 14rem)",
        }}
      >
        {/* Navbar - Same as HomePage */}

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
                  // onClick={handleLogin}
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

        <Outlet />

        {/* Footer - Same as HomePage */}
        <footer className="bg-[#c7bead] py-4 mt-8 flex justify-center">
          <div className="text-black text-sm">
            Copyright © 2025 | Privacy Policy
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomepageLayout;
