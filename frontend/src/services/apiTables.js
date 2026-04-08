import { axiosInstance } from "@/lib/axios";

export const getTables = async () => {
  try {
    const { data } = await axiosInstance.get("/tables");

    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tables");
  }
};

export const createTable = async (tableData) => {
  try {
    const response = await axiosInstance.post("/tables", tableData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create table");
  }
};

export const updateTable = async ({ id, ...tableData }) => {
  try {
    const response = await axiosInstance.put(`/tables/${id}`, tableData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update table");
  }
};

export const deleteTable = async (id) => {
  try {
    const response = await axiosInstance.delete(`/tables/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete table");
  }
};
