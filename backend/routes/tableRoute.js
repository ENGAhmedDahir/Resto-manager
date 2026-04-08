import express from "express";
import {
    createTable,
    getAllTables,
    getTable,
    updateTable,
    updateTableStatus,
    deleteTable,
} from "../controllers/tableController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

router
    .route("/")
    .get(getAllTables)
    .post(restrictTo("admin", "manager"), createTable);

router
    .route("/:id")
    .get(getTable)
    .put(restrictTo("admin", "manager"), updateTable)
    .delete(restrictTo("admin", "manager"), deleteTable);

// Specific status update route - maybe accessible by waiters/cashiers
router
    .route("/:id/status")
    .put(restrictTo("admin", "manager", "cashier", "waiter"), updateTableStatus);

export default router;
