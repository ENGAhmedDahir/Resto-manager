import express from "express";
import {
    createCategoryInventory,
    getCategoryInventories,
    getCategoryInventoryById,
    updateCategoryInventory,
    deleteCategoryInventory,
} from "../controllers/categoryInventoryController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route("/")
    .get(getCategoryInventories)
    .post(restrictTo("admin", "manager"), createCategoryInventory);

router
    .route("/:id")
    .get(getCategoryInventoryById)
    .patch(restrictTo("admin", "manager"), updateCategoryInventory)
    .delete(restrictTo("admin", "manager"), deleteCategoryInventory);

export default router;
