import express from "express";
import {
  createInventoryItem,
  getAllInventory,
  addStock,
  removeStock,
  getLowStockItems,
  getAllStocks,
  updateInventory,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/low-stock").get(getLowStockItems);
router.route("/stock-logs").get(getAllStocks);

router
  .route("/")
  .get(getAllInventory)
  .post(restrictTo("admin", "manager"), createInventoryItem);

router
  .route("/:id/add-stock")
  .put(restrictTo("admin", "manager", "chef"), addStock);

router
  .route("/:id/remove-stock")
  .put(restrictTo("admin", "manager", "chef"), removeStock);

router
  .route("/:id")
  .put(restrictTo("admin", "manager"), updateInventory)
  .delete(restrictTo("admin", "manager"), deleteInventoryItem);

export default router;
