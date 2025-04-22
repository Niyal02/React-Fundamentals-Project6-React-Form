import instance from "../axios/axios";

export const fetchCategories = async (): Promise<
  Array<{ uuid: string; name: string }>
> => {
  try {
    const response = await instance.get("/categories/all");
    return response.data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};
