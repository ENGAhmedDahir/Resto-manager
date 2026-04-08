import { axiosInstance } from "@/lib/axios";

export async function getMenus() {
  try {
    const res = await axiosInstance.get("/menu/getAll-menu");

    const data = res.data.data;

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch Menu"
    );
  }
}
export async function createMenu(formData) {
  try {
    const { data } = await axiosInstance.post("/menu/create-menu", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create Menu"
    );
  }
}

export async function updateMenu({ id, updatedMenu }) {
  try {
    const res = await axiosInstance.put(`/menu/update-menu/${id}`, updatedMenu);

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update Menu"
    );
  }
}

export async function deleteMenu(id) {
  try {
    const res = await axiosInstance.delete(`/menu/delete-menu/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete Menu"
    );
  }
}
