import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import { addImageToDb } from "../utils/uploadToCloudinary.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/create-category",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  addImageToDb,
  createCategory,
);
categoryRouter.get(
  "/getAll-category",
  protect,
  restrictTo("admin"),
  getCategories,
);
categoryRouter.get(
  "/get-category/:id",
  protect,
  restrictTo("admin"),
  getCategoryById,
);
categoryRouter.put(
  "/update-category/:id",
  protect,
  restrictTo("admin"),
  upload.single("image"),
  addImageToDb,
  updateCategory,
);
categoryRouter.delete(
  "/delete-category/:id",
  protect,
  restrictTo("admin"),
  deleteCategory,
);

export default categoryRouter;
