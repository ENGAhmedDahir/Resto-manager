import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportReportsToExcel(reports) {
  if (!reports) return;

  const stats = reports.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  };

  const workbook = XLSX.utils.book_new();

  // ---- Stats sheet ----
  const statsData = [
    ["Metric", "Value"],
    ["Total Revenue", stats.totalRevenue],
    ["Total Orders", stats.totalOrders],
    ["Average Order Value", stats.averageOrderValue],
  ];
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsSheet, "Stats");

  // ---- Revenue Chart sheet ----
  const revenueChartData = [
    ["Month", "Revenue"],
    ...(reports.revenueChart || []).map((item) => [
      `Month ${item._id.month}`,
      item.revenue || 0,
    ]),
  ];
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueChartData);
  XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue Chart");

  // ---- Revenue by Category ----
  const categoryData = [
    ["Category", "Revenue", "Percentage"],
    ...(reports.revenueByCategory || []).map((c) => [
      c.categoryName || "-",
      c.revenue || 0,
      c.percentage || 0,
    ]),
  ];
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, "Revenue by Category");

  // ---- Top Selling Items ----
  const topItemsData = [
    ["Item", "Quantity Sold", "Revenue"],
    ...(reports.topSellingItems || []).map((item) => [
      item._id || "-",
      item.totalSold || 0,
      item.revenue || 0,
    ]),
  ];
  const topItemsSheet = XLSX.utils.aoa_to_sheet(topItemsData);
  XLSX.utils.book_append_sheet(workbook, topItemsSheet, "Top Selling Items");

  // ---- Download Excel ----
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `Reports_${new Date().toISOString().split("T")[0]}.xlsx`);
}
