import { useQuery } from "@tanstack/react-query";
import ProductCard from "../productCard/ProductCard";

import { motion } from "framer-motion";
import instance from "../../axios/axios";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, cart, isMutating } = useCart();
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Filter products based on search term or selected category
  // const filteredProducts = searchTerm
  //   ? products.filter((product: Product) =>
  //       product.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   : selectedCategory
  //   ? products.filter(
  //       (product: Product) => product.category === selectedCategory
  //     )
  //   : products;

  return (
    <div>
      {/* Product Card component */}
      <main className="flex-1 py-6 sm:px-6 lg:px-8 pl-8">
        {isProductsLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <ProductCard>
            {products.map((product: Product) => {
              const isInCart = cart?.items.some(
                (item) => item.product.uuid === product.uuid
              );
              return (
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

                  <div className="flex justify-between items-center">
                    <p className="mt-1 text-lg font-medium text-orange-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        const added = addToCart(product.uuid);
                        if (!added) {
                          toast("Please login to add items to your cart");
                          navigate("/login");
                        }
                      }}
                      disabled={isMutating(product.uuid)}
                      className={`px-3 py-1 rounded text-sm ${
                        isInCart
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                      } ${
                        isMutating(product.uuid)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isMutating(product.uuid)
                        ? "Processing..."
                        : isInCart
                        ? "Add to Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </ProductCard>
        )}
      </main>
    </div>
  );
};

export default HomePage;
