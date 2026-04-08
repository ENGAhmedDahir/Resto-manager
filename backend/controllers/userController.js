import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

export const getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: users.length,
    data: users,
  });
});

export const getUser = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("user not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = CatchAsync(async (req, res, next) => {
  /// 1) create error if user posts the password data
  if (req.body.password) {
    return next(
      new AppError(
        "this route is not for password update . please use /updateMyPassword",
        400
      )
    );
  }
  /// filerd out unwanted field names that aren't allowed to update
  const filteredBody = filterObj(req.body, "username", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  /// 2) update the user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    updatedUser,
  });
});

export const updateUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.password) {
    return next(
      new AppError(
        "this route is not for password update . please use /updateMyPassword",
        400
      )
    );
  }
  /// filerd out unwanted field names that aren't allowed to update
  const filteredBody = filterObj(
    req.body,
    "username",
    "email",
    "role",
    "status"
  );
  if (req.file) filteredBody.photo = req.file.filename;
  /// 2) update the user document

  const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    updatedUser,
  });
});
// ✅ Delete single user by ID
export const deleteUser = CatchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ✅ Delete multiple users we will use in V2
export const deleteUsers = CatchAsync(async (req, res, next) => {
  const { ids } = req.body; // expects { "ids": ["id1", "id2", "id3"] }

  if (!ids || ids.length === 0)
    return next(new AppError("No user IDs provided", 400));

  await User.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
    message: "Selected users deleted successfully",
  });
});
