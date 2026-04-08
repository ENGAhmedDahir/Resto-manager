import MenuItem from "../models/menuItemModel.js";
import AppError from "../utils/appError.js";
import { CatchAsync } from "../utils/CatchAsync.js";

// ➕ Create a new menu item
export const createMenuItem = CatchAsync(async (req, res, next) => {
  const { name, price, category, image, description, available } = req.body;

  // Check if menu item already exists
  const existing = await MenuItem.findOne({ name });
  if (existing) {
    return next(new AppError("Menu item already exists", 400));
  }
  let imageUrl;
  if (req.file) imageUrl = req.file.filename;

  const menuItem = await MenuItem.create({
    name,
    price,
    category,
    image: imageUrl,
    description,
    available,
  });

  res.status(201).json({
    status: "success",
    message: "Menu item created successfully",
    data: menuItem,
  });
});

// 📋 Get all menu items
export const getMenuItems = CatchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find()
    .populate("category", "name ") // since category references User
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    count: menuItems.length,
    data: menuItems,
  });
});

// 🔍 Get a single menu item by ID
export const getMenuItemById = CatchAsync(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id).populate(
    "category",
    "name email"
  );

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: menuItem,
  });
});

// ✏️ Update menu item
export const updateMenuItem = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, category, description, available } = req.body;

  const updateData = {
    name,
    price,
    category,
    description,
    available,
  };

  // handle image (icon OR uploaded file)
  if (req.file) {
    updateData.image = req.file.filename;
  }

  const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Menu item updated successfully",
    data: menuItem,
  });
});

// ❌ Delete menu item
export const deleteMenuItem = CatchAsync(async (req, res, next) => {
  const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Menu item deleted successfully",
  });
});
