import { axiosInstance } from "@/lib/axios";

export async function getCategories() {
  try {
    const res = await axiosInstance.get("/category/getAll-category");

    const data = res.data.data;

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch category"
    );
  }
}
export async function createCategory(formData) {
  try {
    const { data } = await axiosInstance.post(
      "/category/create-category",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create category"
    );
  }
}

export async function updateCategory({ id, updatedCategory }) {
  try {
    const res = await axiosInstance.put(
      `/category/update-category/${id}`,
      updatedCategory
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update category"
    );
  }
}

export async function deleteCategory(id) {
  try {
    const res = await axiosInstance.delete(`/category/delete-category/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete category"
    );
  }
}
