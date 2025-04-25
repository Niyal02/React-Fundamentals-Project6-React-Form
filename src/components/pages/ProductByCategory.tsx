import { useQuery } from "@tanstack/react-query";
import instance from "../../axios/axios";
import ProductCard from "../productCard/ProductCard";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";

type Product = {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

const fetchCategoryProducts = async (id: string) => {
  try {
    const response = await instance.get(`products/all?categories=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch category products", error);
    throw error;
  }
};

const ProductByCategory = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, isMutating } = useCart();
  const params = useParams();
  const categoryId = params.id || "";
  const { data: products = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => fetchCategoryProducts(categoryId),
    enabled: !!categoryId,
  });

  return (
    <main className="flex-1 py-6 sm:px-6 lg:px-8 pl-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700"></h2>

      {isCategoriesLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <ProductCard>
          {products.map((product: Product) => {
            const isInCart = cartItems.some(
              (item) => item.productId === product.uuid
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
                      const added = addToCart(product);
                      if (!added) {
                        navigate("/login", {
                          state: { from: window.location.pathname },
                        });
                      }
                    }}
                    disabled={isMutating(product.uuid)}
                    className={`px-3 py-1 rounded text-sm ${
                      isInCart
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
                      ? "Remove from Cart"
                      : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </ProductCard>
      )}
    </main>
  );
};

export default ProductByCategory;
