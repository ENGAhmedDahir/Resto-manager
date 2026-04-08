import { axiosInstance } from "@/lib/axios";

export const getCategoryInventories = async () => {
    try {
        const { data } = await axiosInstance.get("/category-inventory");
        return data.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch inventory categories",
        );
    }
};

export const createCategoryInventory = async (categoryData) => {
    try {
        const response = await axiosInstance.post("/category-inventory", categoryData);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to create inventory category",
        );
    }
};

export const updateCategoryInventory = async ({ id, ...categoryData }) => {
    try {
        const response = await axiosInstance.patch(`/category-inventory/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to update inventory category",
        );
    }
};

export const deleteCategoryInventory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/category-inventory/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to delete inventory category",
        );
    }
};
