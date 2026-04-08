import express from "express";
import { getReports } from "../controllers/ReportsController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const reportRouter = express.Router();

reportRouter.use(protect, restrictTo("admin"));

reportRouter.get("/", getReports);
export default reportRouter;
