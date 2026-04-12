import mongoose from "mongoose";
import Setting from "./settingModel.js"; // ✅ muhiim

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String },
    description: { type: String },
    taxRate: {
      type: Number,
      default: 0,
    },
    available: { type: Boolean, default: true },
    ingredients: [
      {
        inventoryItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

menuItemSchema.pre("save", async function (next) {
  if (this.isNew || !this.isModified("taxRate")) {
    const settings = await Setting.findOne(); // ✅ fix
    if (settings) {
      this.taxRate = settings.taxRate;
    }
  }
  next();
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
