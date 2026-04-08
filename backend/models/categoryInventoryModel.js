import mongoose from "mongoose";

const categoryInventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const CategoryInventory = mongoose.model("CategoryInventory", categoryInventorySchema);

export default CategoryInventory;
