import { axiosInstance } from "@/lib/axios";

export const getInventory = async () => {
  try {
    const { data } = await axiosInstance.get("/inventory");

    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch inventory",
    );
  }
};

export const createInventoryItem = async (itemData) => {
  try {
    const response = await axiosInstance.post("/inventory", itemData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create inventory item",
    );
  }
};

export const updateInventoryItem = async ({ id, ...itemData }) => {
  try {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update inventory item",
    );
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete inventory item",
    );
  }
};

export const addStock = async ({ id, quantity, reason }) => {
  try {
    const response = await axiosInstance.put(`/inventory/${id}/add-stock`, {
      quantity,
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add stock");
  }
};

export const removeStock = async ({ id, quantity, reason }) => {
  try {
    const response = await axiosInstance.put(`/inventory/${id}/remove-stock`, {
      quantity,
      reason,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to remove stock");
  }
};
export const getStockLogs = async () => {
  try {
    const { data } = await axiosInstance.get("/inventory/stock-logs");
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch stock logs",
    );
  }
};
