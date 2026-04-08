import Order from "../models/orderModel.js";
import MenuItem from "../models/menuItemModel.js";
import Table from "../models/tableModel.js"; // Import Table
import Inventory from "../models/inventoryModel.js"; // Import Inventory
import StockLog from "../models/stockLogModel.js"; // Import StockLog
import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";

export const createOrder = CatchAsync(async (req, res, next) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    items,
    orderType,
    tableNumber,
    deliveryAddress,
    paymentMethod,
    paymentStatus,
    notes,
  } = req.body;

  // Validate required fields

  if (!items || items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  if (!orderType) {
    return next(new AppError("Order type is required", 400));
  }

  // Validate order type specific requirements
  if (orderType === "dine-in" && !tableNumber) {
    return next(
      new AppError("Table number is required for dine-in orders", 400),
    );
  }

  if (orderType === "delivery") {
    if (!customerEmail) {
      return next(new AppError("Email is required for delivery orders", 400));
    }
    if (!customerName || !customerName.trim()) {
      return next(new AppError("Customer name is required", 400));
    }
    if (!customerPhone) {
      return next(
        new AppError("Phone number is required for delivery orders", 400),
      );
    }
    if (!deliveryAddress || !deliveryAddress.fullAddress) {
      return next(
        new AppError("Delivery address is required for delivery orders", 400),
      );
    }
  }

  if (orderType === "takeaway") {
    if (!customerName || !customerName.trim()) {
      return next(new AppError("Customer name is required", 400));
    }
  }

  // Validate and populate menu items
  const populatedItems = await Promise.all(
    items.map(async (item) => {
      if (!item.menuItem) {
        throw new AppError("Menu item ID is required for each item", 400);
      }

      if (!item.quantity || item.quantity < 1) {
        throw new AppError("Valid quantity is required for each item", 400);
      }

      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        throw new AppError(`Menu item not found: ${item.menuItem}`, 404);
      }

      // Check if menu item is available
      if (menuItem.availability === false) {
        throw new AppError(
          `Menu item "${menuItem.name}" is not available`,
          400,
        );
      }

      return {
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price, // Capture price at time of order
      };
    }),
  );

  // Create order object
  const orderData = {
    customerName: customerName?.trim(),
    customerEmail: customerEmail?.trim().toLowerCase(),
    customerPhone: customerPhone?.trim(),
    items: populatedItems,
    orderType,
    paymentMethod: paymentMethod || "Cash",
    paymentStatus: paymentStatus || "Pending",
    notes: notes?.trim(),
  };

  // Add type-specific fields
  if (orderType === "dine-in") {
    // 1️⃣ Find by tableNumber (string) or _id
    let table = await Table.findOne({ tableNumber: tableNumber });
    if (!table && mongoose.Types.ObjectId.isValid(tableNumber)) {
      table = await Table.findById(tableNumber);
    }

    if (table) {
      orderData.tableNumber = table._id; // Store as ObjectId ref
      table.status = "occupied";
      await table.save();
    } else {
      // Fallback: if not found, store raw value (this might fail validation if not ObjectId)
      orderData.tableNumber = tableNumber;
    }
  }

  if (orderType === "delivery" && deliveryAddress) {
    orderData.deliveryAddress = {
      street: deliveryAddress.street?.trim(),
      city: deliveryAddress.city?.trim(),
      state: deliveryAddress.state?.trim(),
      zipCode: deliveryAddress.zipCode?.trim(),
      fullAddress: deliveryAddress.fullAddress?.trim(),
    };
  }

  // Create the order
  const newOrder = await Order.create(orderData);

  // Populate menu item details for response
  await newOrder.populate("items.menuItem", "name category image");

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: {
      order: newOrder,
    },
  });
});

// Additional useful controllers

export const getAllOrders = CatchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("items.menuItem", "name category image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    count: orders.length,
    data: orders,
  });
});
export const getOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "items.menuItem",
    "name category price image description",
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
export const getRecentOrders = CatchAsync(async (req, res, next) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const recentOrders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    results: recentOrders.length,
    data: recentOrders,
  });
});
export const getStats = CatchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalPending: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0],
          },
        },
        totalPreparing: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Preparing"] }, 1, 0],
          },
        },
        totalReady: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Ready"] }, 1, 0],
          },
        },
        totalCancelled: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0],
          },
        },
        totalCompleted: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "Completed"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const result = stats[0] || {};

  res.status(200).json({
    status: "success",
    data: {
      totalPending: result.totalPending || 0,
      totalPreparing: result.totalPreparing || 0,
      totalReady: result.totalReady || 0,
      totalCancelled: result.totalCancelled || 0,
      totalCompleted: result.totalCompleted || 0,
    },
  });
});

// export const updatePaymentStatus = CatchAsync(async (req, res, next) => {
//   const { paymentStatus } = req.body;

//   if (!paymentStatus) {
//     return next(new AppError("Payment status is required", 400));
//   }

//   const order = await Order.findByIdAndUpdate(
//     req.params.id,
//     { paymentStatus },
//     {
//       new: true,
//       runValidators: true,
//     }
//   ).populate("items.menuItem", "name category price");

//   if (!order) {
//     return next(new AppError("Order not found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     message: "Payment status updated successfully",
//     data: {
//       order,
//     },
//   });
// });

export const updatePaymentStatus = CatchAsync(async (req, res, next) => {
  const { isPaid } = req.body;

  // 1️⃣ Validate input
  if (typeof isPaid !== "boolean") {
    return next(new AppError("Invalid payment status", 400));
  }

  // 2️⃣ Find order
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.orderStatus !== "Ready") {
    return next(
      new AppError("Payment can only be completed when order is ready", 400),
    );
  }

  if (order.orderStatus === "Cancelled") {
    // 3️⃣ Prevent updating cancelled orders
    return next(new AppError("Cannot update payment for cancelled order", 400));
  }

  // 4️⃣ Update payment
  order.isPaid = isPaid;
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Payment status updated successfully",
    data: {
      order,
    },
  });
});

export const updateOrderStatus = CatchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;
  const user = req.user;

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled",
  ];

  // 1️⃣ Validate status
  if (!allowedStatuses.includes(orderStatus)) {
    return next(new AppError("Invalid order status", 400));
  }

  // 2️⃣ Find order
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // 3️⃣ Prevent updating cancelled or completed orders
  if (["Cancelled", "Completed"].includes(order.orderStatus)) {
    return next(
      new AppError(`Cannot update status of a ${order.orderStatus} order`, 400),
    );
  }
  if (user.role === "chef") {
    const allowed = ["Preparing", "Ready"];
    if (!allowed.includes(orderStatus)) {
      return res.status(403).json({ message: "Chef cannot set this status" });
    }
  }
  // Prevent completing order before payment
  if (orderStatus === "Completed" && !order.isPaid) {
    return next(
      new AppError("Order must be paid before marking as completed", 400),
    );
  }

  // 4️⃣ Update status
  order.orderStatus = orderStatus;
  await order.save();

  // ---------------------------------------------------------
  // INTEGRATION LOGIC: Table Status & Inventory Deduction
  // ---------------------------------------------------------

  if (orderStatus === "Completed") {
    // A) Free up the table if it was dine-in
    if (order.orderType === "dine-in" && order.tableNumber) {
      const table = await Table.findById(order.tableNumber);
      if (table) {
        table.status = "available";
        await table.save();
      }
    }

    // B) Deduct Inventory
    // We need to fetch the order items with their nested menu items AND ingredients
    // The order.items array has { menuItem: ObjectId, quantity: Number }
    // We populated menuItem in finding existing order?
    // Let's re-fetch to be safe and deep populate ingredients.

    const fullOrder = await Order.findById(req.params.id).populate({
      path: "items.menuItem",
      populate: { path: "ingredients.inventoryItem" },
    });

    for (const item of fullOrder.items) {
      const menuItem = item.menuItem;
      const orderQty = item.quantity; // How many burgers ordered

      if (menuItem.ingredients && menuItem.ingredients.length > 0) {
        for (const ing of menuItem.ingredients) {
          if (!ing.inventoryItem) continue; // Skip if link broken

          const inventoryItem = await Inventory.findById(ing.inventoryItem._id);
          const amountToDeduct = ing.quantity * orderQty; // (qty per burger) * (burgers ordered)

          if (inventoryItem) {
            inventoryItem.quantity -= amountToDeduct;
            if (inventoryItem.quantity < 0) inventoryItem.quantity = 0; // Prevent negative? Or allow and show negative?
            await inventoryItem.save();

            // Create Stock Log (Ref User? We have req.user)
            await StockLog.create({
              item: inventoryItem._id,
              type: "OUT",
              quantity: amountToDeduct,
              reason: `Order #${order._id} Completed`,
              doneBy: user._id,
            });
          }
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: {
      order,
    },
  });
});

export const cancelOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.orderStatus === "Completed") {
    return next(new AppError("Cannot cancel a completed order", 400));
  }

  if (order.orderStatus === "Cancelled") {
    return next(new AppError("Order is already cancelled", 400));
  }

  order.orderStatus = "Cancelled";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
    data: {
      order,
    },
  });
});

export const deleteOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  res.status(204).json({
    status: "success",
    message: "Order deleted successfully",
    data: null,
  });
});
