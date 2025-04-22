import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/categories";

export const useCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  return query;
};
