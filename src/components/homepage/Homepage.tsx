import { useQuery } from "@tanstack/react-query";
import axios from "../../axios/axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Product = {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
};

const fetchProducts = async () => {
  try {
    const response = await axios.get("/products");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#dad5cb]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Company Logo - Aligned to left */}
            <div className="flex items-center">
              <Link to="/homepage" className="flex-shrink-0 flex items-center">
                <span className="text-3xl font-bold gap-2">
                  <span className="text-orange-500 size-2">
                    🧑‍💻 Rex IT Solutions
                  </span>
                </span>
              </Link>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center">
              {accessToken ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{userName}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Link
                    to="/login"
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Shifted left */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pl-8">
        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product: Product) => (
              <div
                key={product.uuid}
                className="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-orange-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 mt-8 flex justify-baseline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          Copyright © 2025 | Privacy Polic
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
