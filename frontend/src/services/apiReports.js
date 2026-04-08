import { axiosInstance } from "@/lib/axios";

export async function getReports(period = "today") {
  try {
    const { data } = await axiosInstance.get("/reports", {
      params: { period },
    });

    // backend response: { status, data }
    return data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch reports";

    throw new Error(message);
  }
}
