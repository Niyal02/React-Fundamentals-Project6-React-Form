import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import instance from "../../axios/axios";
import ProductCard from "../productCard/ProductCard";

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

type OutletContextType = {
  searchTerm: string;
  selectedCategory: string | null;
};

const HomePage = () => {
  const { searchTerm, selectedCategory } =
    useOutletContext<OutletContextType>();
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

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
    <div>
      {isProductsLoading ? (
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
    </div>
  );
};

export default HomePage;
