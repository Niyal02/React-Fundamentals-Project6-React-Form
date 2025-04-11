import instance from "../axios/axios";

export const fetchCategories = async (): Promise<
  Array<{ uuid: string; name: string }>
> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const response = await instance.get("/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};
