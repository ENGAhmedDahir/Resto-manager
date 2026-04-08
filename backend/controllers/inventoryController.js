import Inventory from "../models/inventoryModel.js";
import StockLog from "../models/stockLogModel.js";
import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";

export const createInventoryItem = CatchAsync(async (req, res, next) => {
  const {
    itemName,
    category,
    quantity,
    unit,
    costPrice,
    supplier,
    lowStockLevel,
  } = req.body;

  // Check if item already exists
  const existingItem = await Inventory.findOne({
    itemName: { $regex: new RegExp(`^${itemName}$`, "i") }, // Case insensitive check
  });

  if (existingItem) {
    return next(new AppError("Inventory item already exists", 400));
  }

  const newItem = await Inventory.create({
    itemName,
    category,
    quantity,
    unit,
    costPrice,
    supplier,
    lowStockLevel,
    createdBy: req.user._id, // Assuming protected route adds user to req
  });

  // Create initial log
  await StockLog.create({
    item: newItem._id,
    type: "IN",
    quantity: quantity,
    reason: "Initial Stock",
    doneBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: newItem,
  });
});

export const addStock = CatchAsync(async (req, res, next) => {
  const { quantity, reason } = req.body;
  const { id } = req.params;

  if (!quantity || quantity <= 0) {
    return next(new AppError("Please provide a valid quantity to add", 400));
  }

  const item = await Inventory.findById(id);
  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  item.quantity += quantity;
  await item.save();

  // Log the action
  await StockLog.create({
    item: item._id,
    type: "IN",
    quantity: quantity,
    reason: reason || "Restock",
    doneBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    message: "Stock added successfully",
    data: item,
  });
});

export const removeStock = CatchAsync(async (req, res, next) => {
  const { quantity, reason } = req.body;
  const { id } = req.params;

  if (!quantity || quantity <= 0) {
    return next(new AppError("Please provide a valid quantity to remove", 400));
  }

  const item = await Inventory.findById(id);
  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  if (item.quantity < quantity) {
    return next(
      new AppError(
        `Insufficient stock. Current quantity: ${item.quantity}`,
        400,
      ),
    );
  }

  item.quantity -= quantity;
  await item.save();

  // Log the action
  await StockLog.create({
    item: item._id,
    type: "OUT",
    quantity: quantity,
    reason: reason || "Manual Deduction",
    doneBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    message: "Stock removed successfully",
    data: item,
  });
});

export const getAllInventory = CatchAsync(async (req, res, next) => {
  const items = await Inventory.find()
    .populate("category", "name")
    .populate("createdBy", "name email");

  res.status(200).json({
    status: "success",
    results: items.length,
    data: items,
  });
});

export const getAllStocks = CatchAsync(async (req, res, next) => {
  const logs = await StockLog.find()
    .populate("item", "itemName unit")
    .populate("doneBy", "username role email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: logs.length,
    data: logs,
  });
});

export const getLowStockItems = CatchAsync(async (req, res, next) => {
  // Find items where quantity is less than or equal to lowStockLevel
  const items = await Inventory.find({
    $expr: { $lte: ["$quantity", "$lowStockLevel"] },
  });

  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});

export const updateInventory = CatchAsync(async (req, res, next) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  // Update fields
  const allowedFields = [
    "itemName",
    "category",
    "quantity",
    "unit",
    "costPrice",
    "supplier",
    "lowStockLevel",
  ];
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      item[key] = req.body[key];
    }
  });

  await item.save();

  res.status(200).json({
    status: "success",
    data: item,
  });
});

export const deleteInventoryItem = CatchAsync(async (req, res, next) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new AppError("Inventory item not found", 404));
  }

  // Optional: Delete associated logs? Or keep them for history?
  // Keeping logs is usually safer for audit trails.

  res.status(204).json({
    status: "success",
    data: null,
  });
});
