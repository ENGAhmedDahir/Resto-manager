import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryInventory",
      required: [true, "Category is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be less than 0"],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["kg", "liter", "piece", "bottle", "gm", "ml", "pack"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    lowStockLevel: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

inventorySchema.pre("save", function (next) {
  const quantity = this.quantity ?? 0;
  const lowStockLevel = this.lowStockLevel ?? 5;

  if (quantity === 0) {
    this.status = "Out of Stock";
  } else if (quantity <= lowStockLevel) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
