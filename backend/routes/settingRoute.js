import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSettings).put(restrictTo("admin"), updateSettings);

export default router;
