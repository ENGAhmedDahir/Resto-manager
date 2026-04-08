import Order from "../models/orderModel.js";
import MenuItem from "../models/menuItemModel.js";
import AppError from "../utils/appError.js";
import { CatchAsync } from "../utils/CatchAsync.js";

// 🟢 Create a new order
export const createOrder = CatchAsync(async (req, res, next) => {
  const {
    customerName,
    items,
    subtotal,
    tax,
    orderType,
    tableNumber,
    deliveryAddress,
    paymentMethod,

    orderStatus,
    paymentStatus,
    notes,
  } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("Order must contain at least one item", 400));
  }

  if (orderType === "dine-in") {
    return next(new AppError("table number is required"));
  }
  if (orderType === "takeaway") {
    // some info

    return next(new AppError("table number is required"));
  }
  if (orderType === "delivery") {
    // full into :
    // 1)email  2) phone numer 3)name 4) address
    return next(new AppError("table number is required"));
  }

  // Validate items
  const populatedItems = await Promise.all(
    items.map(async (item) => {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        throw new AppError(`Menu item not found: ${item.menuItem}`, 404);
      }
      return {
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price, // Save price at time of order
      };
    }),
  );

  const totalAmount = populatedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const newOrder = await Order.create({
    customer,
    items: populatedItems,
    totalAmount,
    orderType,
    tableNumber,
    deliveryAddress,
    paymentMethod,
    notes,
  });

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: newOrder,
  });
});

// 🟡 Get all orders
export const getAllOrders = CatchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("customer", "name email")
    .populate("items.menuItem", "name price image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

// 🟣 Get order by ID
export const getOrderById = CatchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("customer", "name email")
    .populate("items.menuItem", "name price image");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

// 🟠 Update order status or payment status
export const updateOrder = CatchAsync(async (req, res, next) => {
  const {
    items,
    orderStatus,
    paymentStatus,
    tableNumber,
    deliveryAddress,
    notes,
  } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  // 🧩 Update item quantities without deleting others
  if (items && items.length > 0) {
    for (const updatedItem of items) {
      const existingItem = order.items.find(
        (item) => item.menuItem.toString() === updatedItem.menuItem,
      );

      if (existingItem) {
        // If item exists → update quantity and refresh price
        const menuItem = await MenuItem.findById(updatedItem.menuItem);
        if (!menuItem)
          throw new AppError(
            `Menu item not found: ${updatedItem.menuItem}`,
            404,
          );

        existingItem.quantity = updatedItem.quantity;
        existingItem.price = menuItem.price; // update price if menu changed
      } else {
        // If it's a new item → add it
        const menuItem = await MenuItem.findById(updatedItem.menuItem);
        if (!menuItem)
          throw new AppError(
            `Menu item not found: ${updatedItem.menuItem}`,
            404,
          );

        order.items.push({
          menuItem: menuItem._id,
          quantity: updatedItem.quantity,
          price: menuItem.price,
        });
      }
    }

    // Recalculate total
    order.totalAmount = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  // 🧠 Update other fields if provided
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (tableNumber) order.tableNumber = tableNumber;
  if (deliveryAddress) order.deliveryAddress = deliveryAddress;
  if (notes) order.notes = notes;

  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: order,
  });
});

// 🔴 Delete order
export const deleteOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
  });
});
