import { axiosInstance } from "@/lib/axios";

export const login = async ({ email, password }) => {
  try {
    const { data } = await axiosInstance.post("/users/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log(error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Failed to Login");
  }
};

export async function signup(newUser) {
  try {
    const { data } = await axiosInstance.post(
      "/users/signup",
      newUser // ✅ send directly
    );
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to signup"
    );
  }
}

// export async function signup({ username, email, password, role }) {
//   try {
//     const { data } = await axiosInstance.post("/users/signup", {
//       username,
//       email,
//       password,
//       role,
//     });
//     return data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || error.message || "Failed to Login"
//     );
//   }
// }
export async function getCurrentUser() {
  try {
    const { data } = await axiosInstance.get("users/getLogin-user");

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to Login"
    );
  }
}
export async function getUsers() {
  try {
    const { data } = await axiosInstance.get("/users/getAll-users");

    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to get users"
    );
  }
}
export async function getUser(id) {
  try {
    const { data } = await axiosInstance.get(`/users/get-user/${id}`);

    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to get user"
    );
  }
}
export async function updateUser({ id, updatedUser }) {
  try {
    const res = await axiosInstance.put(
      `/users/update-user/${id}`,
      updatedUser
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update user Data"
    );
  }
}
export async function updateUserPassword({ id, currentPassword, newPassword }) {
  try {
    const url = id
      ? `/users/update-password/${id}` // not logged in / admin
      : `/users/update-MyPassword`; // logged in user

    const { data } = await axiosInstance.put(url, {
      currentPassword,
      newPassword,
    });

    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update user password"
    );
  }
}

export async function deleteUser(id) {
  try {
    await axiosInstance.delete(`/users/delete-user/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete user"
    );
  }
}

// export async function forgotPassword(email) {
//   try {
//     await axios.post(`${BASE_URL}/forgotPassword`, { email });
//   } catch (error) {
//     console.log(error);
//   }
// }
// export async function resetPassword(newPassword, token) {
//   try {
//     await axios.patch(`${BASE_URL}/resetPassword/${token}`, {
//       newPassword,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function updatePassword({ currentPassword, newPassword }) {
//   try {
//     await axios.patch(`${BASE_URL}/updateMyPassword`, {
//       currentPassword,
//       newPassword,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function updateMe({ name, email, photo }) {
//   try {
//     await axios.patch(`${BASE_URL}/updateMe`, {
//       name,
//       email,
//       photo,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }
