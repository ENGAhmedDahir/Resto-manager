import Order from "../models/orderModel.js";
import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";
import { getDateRange } from "../utils/getDateRange.js";

const statsPipeline = (start, end) => [
  {
    $match: {
      createdAt: { $gte: start, $lte: end },
    },
  },
  {
    $group: {
      _id: null,

      // 💰 Revenue from COMPLETED orders only
      totalRevenue: {
        $sum: {
          $cond: [{ $eq: ["$orderStatus", "Completed"] }, "$totalAmount", 0],
        },
      },

      // 📦 ALL orders (any status)
      totalOrders: { $sum: 1 },

      // ✅ Only COMPLETED orders
      totalCompletedOrders: {
        $sum: {
          $cond: [{ $eq: ["$orderStatus", "Completed"] }, 1, 0],
        },
      },

      // 📊 Avg order value (Completed only)
      averageOrderValue: {
        $avg: {
          $cond: [
            { $eq: ["$orderStatus", "Completed"] },
            "$totalAmount",
            "$$REMOVE",
          ],
        },
      },
    },
  },
];

const revenueByDayPipeline = (start, end) => [
  {
    $match: {
      orderStatus: "Completed",
      createdAt: { $gte: start, $lte: end },
    },
  },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      },
      revenue: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
      "_id.day": 1,
    },
  },
];

const revenueByMonthPipeline = (start, end) => [
  {
    $match: {
      orderStatus: "Completed",
      createdAt: { $gte: start, $lte: end },
    },
  },
  {
    $group: {
      _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
      revenue: { $sum: "$totalAmount" },
    },
  },
  { $sort: { "_id.month": 1 } },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      revenue: 1,
    },
  },
  {
    $group: {
      _id: "$year",
      months: {
        $push: {
          month: "$month",
          revenue: "$revenue",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      months: {
        $map: {
          input: { $range: [1, 13] }, // months 1 → 12
          as: "m",
          in: {
            month: "$$m",
            revenue: {
              $let: {
                vars: {
                  found: {
                    $filter: {
                      input: "$months",
                      as: "mon",
                      cond: { $eq: ["$$mon.month", "$$m"] },
                    },
                  },
                },
                in: { $ifNull: [{ $arrayElemAt: ["$$found.revenue", 0] }, 0] },
              },
            },
          },
        },
      },
    },
  },
  { $unwind: "$months" },
  {
    $project: {
      _id: { year: start.getFullYear(), month: "$months.month" },
      revenue: "$months.revenue",
    },
  },
  { $sort: { "_id.month": 1 } },
];

const revenueByCategoryPipeline = (start, end) => [
  {
    $match: {
      orderStatus: "Completed",
      createdAt: { $gte: start, $lte: end },
    },
  },

  { $unwind: "$items" },

  {
    $lookup: {
      from: "menuitems",
      localField: "items.menuItem",
      foreignField: "_id",
      as: "menuItem",
    },
  },
  { $unwind: "$menuItem" },

  {
    $lookup: {
      from: "categories",
      localField: "menuItem.category",
      foreignField: "_id",
      as: "category",
    },
  },
  { $unwind: "$category" },

  // Group by category and sum revenue
  {
    $group: {
      _id: "$category.name",
      revenue: { $sum: "$items.itemTotal" },
    },
  },

  // Sort descending
  { $sort: { revenue: -1 } },

  // Calculate total revenue across all categories using $group + $lookup or $setWindowFields
  {
    $setWindowFields: {
      output: {
        totalRevenue: {
          $sum: "$revenue",
          window: { documents: ["unbounded", "unbounded"] },
        },
      },
    },
  },

  // Add percentage field
  {
    $addFields: {
      percentage: {
        $round: [
          { $multiply: [{ $divide: ["$revenue", "$totalRevenue"] }, 100] },
          2,
        ],
      },
    },
  },

  // Project final fields
  {
    $project: {
      _id: 0,
      categoryName: "$_id",
      revenue: 1,
      percentage: 1,
    },
  },
];

const topSellingItemsPipeline = (start, end) => [
  {
    $match: {
      orderStatus: "Completed",
      createdAt: { $gte: start, $lte: end },
    },
  },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "menuitems",
      localField: "items.menuItem",
      foreignField: "_id",
      as: "menuItem",
    },
  },
  { $unwind: "$menuItem" },
  {
    $group: {
      _id: "$menuItem.name",
      totalSold: { $sum: "$items.quantity" },
      revenue: { $sum: "$items.itemTotal" },
    },
  },
  { $sort: { totalSold: -1 } },
  { $limit: 5 },
];

const ordersByDayPipeline = (start, end) => [
  {
    $match: {
      createdAt: { $gte: start, $lte: end },
    },
  },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      },
      orders: { $sum: 1 }, // 👈 total orders per day
    },
  },
  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
      "_id.day": 1,
    },
  },
];

export const getReports = CatchAsync(async (req, res, next) => {
  const { period = "today" } = req.query;

  let start, end;
  try {
    ({ start, end } = getDateRange(period));
  } catch (err) {
    return next(new AppError("Invalid period value", 400));
  }

  const [stats] = await Order.aggregate(statsPipeline(start, end));

  const revenueChart = await Order.aggregate(
    period === "thisYear"
      ? revenueByMonthPipeline(start, end)
      : revenueByDayPipeline(start, end)
  );

  const ordersChart = await Order.aggregate(ordersByDayPipeline(start, end));

  const revenueByCategory = await Order.aggregate(
    revenueByCategoryPipeline(start, end)
  );

  const topSellingItems = await Order.aggregate(
    topSellingItemsPipeline(start, end)
  );

  res.status(200).json({
    status: "success",
    data: {
      stats: stats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalCompletedOrders: 0,
        averageOrderValue: 0,
      },
      revenueChart,
      ordersChart, // ✅ NEW
      revenueByCategory,
      topSellingItems,
    },
  });
});
