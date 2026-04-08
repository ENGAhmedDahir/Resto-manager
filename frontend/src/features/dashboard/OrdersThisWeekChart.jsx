import { BarChartComponent, ChartContainer } from "@/components/pos/Charts";
import { useReports } from "../reports/useReports";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// helper: YYYY-MM-DD
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function OrdersThisWeekChart() {
  const [period] = useState("thisWeek");
  const { reports, isLoading } = useReports(period);

  const ordersChart = reports?.ordersChart || [];

  const chartData = useMemo(() => {
    const map = new Map();

    ordersChart.forEach((item) => {
      const { year, month, day } = item._id;
      const key = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      map.set(key, item.orders);
    });

    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      data.push({
        label: WEEK_DAYS[d.getDay()],
        orders: Number(map.get(dateKey(d)) || 0),
      });
    }

    return data;
  }, [ordersChart]);

  if (isLoading) return null;

  return (
    <ChartContainer title="Orders This Week">
      {/* Added wrapper */}
      <BarChartComponent data={chartData} dataKey="orders" xAxisKey="label" />
    </ChartContainer>
  );
}

export default OrdersThisWeekChart;
