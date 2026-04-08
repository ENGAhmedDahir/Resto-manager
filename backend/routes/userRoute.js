import express from "express";
import {
  getLoginUser,
  login,
  logout,
  protect,
  restrictTo,
  signup,
  updatePassword,
  verifyEmail,
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController.js";
import { addImageToDb } from "../utils/uploadToCloudinary.js";

const userRouter = express.Router();

userRouter.post("/signup", protect, restrictTo("admin"), signup);

userRouter.post("/verify-email", verifyEmail);
userRouter.post("/login", login);
userRouter.put(
  "/update-user/:id",
  protect,
  restrictTo("admin", "chef"),
  upload.single("photo"),
  addImageToDb,
  updateUser,
);
userRouter.put(
  "/update-me",
  protect,
  upload.single("photo"),
  addImageToDb,
  updateMe,
);
userRouter.put(
  "/update-password/:id",
  protect,

  restrictTo("admin"),
  updatePassword,
);
userRouter.put("/update-myPassword", protect, updatePassword);
userRouter.get("/getAll-users", protect, restrictTo("admin"), getAllUsers);
userRouter.get("/get-user/:id", protect, restrictTo("admin"), getUser);
userRouter.get("/getLogin-user", protect, getLoginUser);

userRouter.get("/logout", logout);
userRouter.delete("/delete-user/:id", protect, restrictTo("admin"), deleteUser);

export default userRouter;
