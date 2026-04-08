import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: "guest",
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    customerPhone: {
      type: String,
      trim: true,
    },

    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      required: true,
      default: "dine-in",
    },

    tableNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },

    deliveryAddress: {
      fullAddress: String,
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        itemTotal: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
      type: Number,
      default: 0.1,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Mobile Money", "Online"],
      default: "Cash",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.menuItem",
    select: "name category image",
    populate: {
      path: "category",
      select: "name",
    },
  }).populate({
    path: "tableNumber",
    select: "tableNumber status",
  });

  next();
});
/* ===============================
   🔒 BULLETPROOF CALCULATIONS
================================ */

orderSchema.pre("validate", function (next) {
  if (!this.items || this.items.length === 0) {
    return next(new Error("Order must have at least one item"));
  }

  let subtotal = 0;

  for (const item of this.items) {
    if (typeof item.price !== "number" || typeof item.quantity !== "number") {
      return next(new Error("Invalid price or quantity"));
    }

    item.itemTotal = item.price * item.quantity;
    subtotal += item.itemTotal;
  }

  this.subtotal = subtotal;
  this.tax = subtotal * this.taxRate;
  this.totalAmount = subtotal + this.tax;

  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
