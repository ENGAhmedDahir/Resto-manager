import express from "express";

import { protect, restrictTo } from "../controllers/authController.js";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  getStats,
  updateOrderStatus,
  updatePaymentStatus,
  getRecentOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();
// public order
// orderRouter.post(
//   "/create-order",
//   protect,
//   restrictTo("admin", "cashier", "chef"),
//   createOrder,
// );
orderRouter.post(
  "/create-order",
  protect,
  restrictTo("admin", "manager", "cashier", "chef"),
  createOrder,
);
orderRouter.get(
  "/getAll-orders",
  protect,
  restrictTo("admin", "manager", "cashier", "chef"),
  getAllOrders,
);
orderRouter.get(
  "/get-order/:id",
  protect,
  restrictTo("admin", "manager", "cashier", "chef"),
  getOrder,
);
orderRouter.get("/order-stats", protect, restrictTo("admin"), getStats);
orderRouter.get(
  "/recent-orders",
  protect,
  restrictTo("admin", "manager", "cashier"),
  getRecentOrders,
);
// orderRouter.put("/update-order/:id", updateOrder);
orderRouter.put(
  "/cancel-order/:id",
  protect,
  restrictTo("admin", "manager", "cashier"),
  cancelOrder,
);
orderRouter.put(
  "/update-orderStatus/:id",
  protect,
  restrictTo("admin", "manager", "cashier", "chef"),
  updateOrderStatus,
);
orderRouter.put(
  "/update-paymentStatus/:id",
  protect,
  restrictTo("admin", "manager", "cashier"),
  updatePaymentStatus,
);
orderRouter.delete(
  "/delete-order/:id",
  protect,
  restrictTo("admin"),
  deleteOrder,
);

export default orderRouter;
