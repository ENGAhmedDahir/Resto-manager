import CategoryInventory from "../models/categoryInventoryModel.js";
import AppError from "../utils/appError.js";
import { CatchAsync } from "../utils/CatchAsync.js";

// ➕ Create Category Inventory
export const createCategoryInventory = CatchAsync(async (req, res, next) => {
    const { name, description, isActive } = req.body;

    // Check if category already exists
    const existing = await CategoryInventory.findOne({ name });
    if (existing) {
        return next(new AppError("Category already exists", 400));
    }

    const category = await CategoryInventory.create({
        name,
        description,
        isActive,
    });

    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: category,
    });
});

// 📋 Get all categories
export const getCategoryInventories = CatchAsync(async (req, res, next) => {
    const categories = await CategoryInventory.find().sort({ createdAt: -1 });

    res.status(200).json({
        status: "success",
        count: categories.length,
        data: categories,
    });
});

// 🔍 Get category by ID
export const getCategoryInventoryById = CatchAsync(async (req, res, next) => {
    const category = await CategoryInventory.findById(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: category,
    });
});

// ✏️ Update Category
export const updateCategoryInventory = CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await CategoryInventory.findByIdAndUpdate(
        id,
        { name, description, isActive },
        {
            new: true,
            runValidators: true,
        }
    );

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
export const deleteCategoryInventory = CatchAsync(async (req, res, next) => {
    const category = await CategoryInventory.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
    });
});
