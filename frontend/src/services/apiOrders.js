import { axiosInstance } from "../lib/axios"; // Hubso inaad leedahay axiosInstance

// Create order

export async function createOrder(orderData) {
  try {
    // Align with your backend route
    const { data } = await axiosInstance.post("/order/create-order", orderData);
    console.log(data);
    return data; // expected: { status, message, data: { order } }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create order",
    );
  }
}

// Get all orders
export async function getAllOrders() {
  try {
    const { data } = await axiosInstance.get("/order/getAll-orders");

    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders",
    );
  }
}

// Get order by ID
export async function getOrder(orderId) {
  try {
    const { data } = await axiosInstance.get(`/order/get-order/${orderId}`);

    return data.data.order;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch order",
    );
  }
}

export async function getOrderStats() {
  try {
    const { data } = await axiosInstance.get("/order/order-stats");
    console.log(data);
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch order stats",
    );
  }
}

export async function getRecentOrders() {
  try {
    const { data } = await axiosInstance.get("/order/recent-orders");
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch recent order ",
    );
  }
}

// Get customer orders
export async function getCustomerOrders(customerId) {
  try {
    const { data } = await axiosInstance.get(`/order/customer/${customerId}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch customer orders",
    );
  }
}

// Update order
export async function updateOrder(orderId, updateData) {
  try {
    const { data } = await axiosInstance.patch(`/order/${orderId}`, updateData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update order",
    );
  }
}

export async function cancelOrder(orderId) {
  try {
    const { data } = await axiosInstance.put(`/order/cancel-order/${orderId}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to cancel order",
    );
  }
}
export async function updateOrderStatus({ orderId, newStatus }) {
  try {
    const { data } = await axiosInstance.put(
      `/order/update-orderStatus/${orderId}`,
      {
        orderStatus: newStatus,
      },
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update order status",
    );
  }
}
export async function updatePaymentStatus({ orderId, isPaid }) {
  try {
    const { data } = await axiosInstance.put(
      `/order/update-paymentStatus/${orderId}`,
      {
        isPaid: isPaid, // Changed from paymentStatus to isPaid
      },
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update payment status",
    );
  }
}
// Delete order
export async function deleteOrder(orderId) {
  try {
    const { data } = await axiosInstance.delete(
      `/order/delete-order/${orderId}`,
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete order",
    );
  }
}
