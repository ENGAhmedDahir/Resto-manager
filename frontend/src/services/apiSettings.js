import { axiosInstance } from "@/lib/axios";

export const getSettings = async () => {
  try {
    const { data } = await axiosInstance.get("/settings");
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch settings",
    );
  }
};

export const updateSettings = async (newSettings) => {
  try {
    const { data } = await axiosInstance.put("/settings", newSettings);
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update settings",
    );
  }
};
