import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuItemController.js";

import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import { addImageToDb } from "../utils/uploadToCloudinary.js";

const menuRouter = express.Router();

menuRouter.post(
  "/create-menu",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  addImageToDb,
  createMenuItem,
);

menuRouter.get(
  "/getAll-menu",
  protect,
  restrictTo("admin", "manager", "chef", "cashier"),
  getMenuItems,
);
menuRouter.get("/get-menu/:id", protect, getMenuItemById);
menuRouter.put(
  "/update-menu/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  addImageToDb,
  updateMenuItem,
);
menuRouter.delete(
  "/delete-menu/:id",
  protect,
  restrictTo("admin"),
  deleteMenuItem,
);

export default menuRouter;
