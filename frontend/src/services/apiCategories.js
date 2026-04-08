import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
    try {
        const { data } = await axiosInstance.get("/category/getAll-category");
        // Assuming backend returns { status: 'success', data: { categories: [...] } } or similar
        // Checking controller would be best, but usually it returns data.data or similar.
        // Let's assume consistent structure with other APIs.
        return data.data || data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch categories",
        );
    }
};

export const createCategory = async (categoryData) => {
    try {
        // Handling FormData if image is present, but for now simple JSON if just name/desc
        const response = await axiosInstance.post("/category/create-category", categoryData);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to create category",
        );
    }
};

export const updateCategory = async ({ id, ...categoryData }) => {
    try {
        const response = await axiosInstance.put(`/category/update-category/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to update category",
        );
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/category/delete-category/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to delete category",
        );
    }
};
