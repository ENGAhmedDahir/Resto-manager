import { ChartContainer } from "@/components/pos/Charts";
import { AreaChartComponent } from "@/components/pos/Charts"; // import your AreaChart

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildChartData(rawData, period) {
  const map = new Map();

  if (period === "thisYear") {
    // Backend gives { _id: { month }, revenue }
    rawData.forEach((item) => {
      const month = item._id.month;
      map.set(month, item.revenue);
    });

    const data = [];
    for (let m = 1; m <= 12; m++) {
      data.push({
        label: MONTH_NAMES[m - 1],
        revenue: Number(map.get(m) || 0),
      });
    }
    return data;
  }

  // For daily data (today, thisWeek, thisMonth)
  rawData.forEach((item) => {
    const { year, month, day } = item._id || {};
    const key = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    map.set(key, item.revenue);
  });

  const today = new Date();
  const data = [];

  if (period === "today") {
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
    data.push({ label: "Today", revenue: Number(map.get(key) || 0) });
  }

  if (period === "thisWeek") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;

      data.push({
        label: WEEK_DAYS[d.getDay()], // ✅ Mon, Tue, Wed...
        revenue: Number(map.get(key) || 0),
      });
    }
  }

  if (period === "thisMonth") {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      data.push({ label: day.toString(), revenue: Number(map.get(key) || 0) });
    }
  }

  return data;
}

function RevenueAndOrdersChart({ reports, period, isLoading }) {
  if (isLoading) return null;

  const rawData = reports?.revenueChart || [];
  const chartData = buildChartData(rawData, period);

  return (
    <div className="grid grid-cols-1 gap-4">
      <ChartContainer title="Revenue Trend">
        <AreaChartComponent
          data={chartData}
          dataKey="revenue"
          xAxisKey="label"
          color="hsl(32, 95%, 55%)"
          gradient={true}
        />
      </ChartContainer>
    </div>
  );
}

export default RevenueAndOrdersChart;
