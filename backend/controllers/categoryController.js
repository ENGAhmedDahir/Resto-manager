import Category from "../models/categoryModel.js";
import AppError from "../utils/appError.js";
import { CatchAsync } from "../utils/CatchAsync.js";

// ➕ Create Category
export const createCategory = CatchAsync(async (req, res, next) => {
  const { name, description, image, isActive } = req.body;

  // Check if category already exists
  const existing = await Category.findOne({ name });
  if (existing) {
    return next(new AppError("Category already exists", 400));
  }

  // ✅ Image ama icon mid keliya ayaa la keydiyaa
  let imageValue = image; // icon (emoji) from req.body

  // ✅ Haddii file upload la sameeyay, use that instead
  if (req.file) {
    imageValue = req.file.filename;
  }

  const category = await Category.create({
    name,
    description,
    image: imageValue,
    isActive,
  });

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

// 📋 Get all categories
export const getCategories = CatchAsync(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    count: categories.length,
    data: categories,
  });
});

// 🔍 Get category by ID
export const getCategoryById = CatchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

// ✏️ Update Category
export const updateCategory = CatchAsync(async (req, res, next) => {
  const { id } = req.params;

  // req.body is now available because of multer
  const { name, description, isActive } = req.body;

  const updateData = {
    name,
    description,
    isActive,
  };

  // handle image (icon OR uploaded file)
  if (req.file) {
    updateData.image = req.file.filename;
  } else if (req.body.image) {
    updateData.image = req.body.image;
  }

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});

// ❌ Delete Category
export const deleteCategory = CatchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});
