import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/categories";

export const useCategories = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  return { categories };
};
