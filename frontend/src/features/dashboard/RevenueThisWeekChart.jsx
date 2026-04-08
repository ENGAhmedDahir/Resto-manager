import { AreaChartComponent, ChartContainer } from "@/components/pos/Charts";
import { useReports } from "../reports/useReports";
import { useState } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// helper: YYYY-MM-DD
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

function RevenueThisWeekChart() {
  const [period] = useState("thisWeek");
  const { reports } = useReports(period);
  const { revenueChart = [] } = reports || {};

  // 1️⃣ Map backend data -> dateKey => revenue
  const revenueMap = new Map();

  revenueChart.forEach((item) => {
    const { year, month, day } = item._id;
    const key = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    revenueMap.set(key, item.revenue);
  });

  // 2️⃣ Build last 7 days (Mon → Sun)
  const today = new Date();
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    chartData.push({
      label: WEEK_DAYS[d.getDay()], // Mon, Tue, Wed...
      revenue: Number(revenueMap.get(dateKey(d)) || 0),
    });
  }

  return (
    <ChartContainer title="Revenue This Week">
      <AreaChartComponent
        data={chartData}
        dataKey="revenue"
        xAxisKey="label"
        gradient
      />
    </ChartContainer>
  );
}

export default RevenueThisWeekChart;
