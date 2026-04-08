import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Chart container component
export function ChartContainer({ title, children, className }) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[250px]">{children}</div>
      </CardContent>
    </Card>
  );
}
// export function ChartContainer({ title, children, className }) {
//   return (
//     <Card className={cn("h-full flex flex-col", className)}>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base font-medium">{title}</CardTitle>
//       </CardHeader>

//       {/* 🔑 height muhiim ah */}
//       <CardContent className="flex-1 min-h-[260px]">{children}</CardContent>
//     </Card>
//   );
// }

// Area chart component
export function AreaChartComponent({
  data,
  dataKey,
  xAxisKey = "name",
  color = "hsl(32, 95%, 55%)",
  gradient = true,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(20, 14%, 14%)" />

        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(20, 10%, 55%)"
          // stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(20, 14%, 7%)",
            color: "#fff",
            border: "1px solid hsl(20, 14%, 14%)",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={gradient ? "url(#areaGradient)" : color}
          fillOpacity={gradient ? 1 : 0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Bar chart component
export function BarChartComponent({
  data,
  dataKey,
  xAxisKey = "name",
  color = "hsl(32, 95%, 55%)",
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(20, 14%, 14%)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(20, 14%, 7%)",
            color: "#fff",
            border: "1px solid hsl(20, 14%, 14%)",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Pie chart component
export function PieChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            // backgroundColor: "hsl(20, 14%, 7%)",

            border: "1px solid hsl(20, 14%, 14%)",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Line chart component
export function LineChartComponent({ data, lines, xAxisKey = "name" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(20, 14%, 14%)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(20, 10%, 55%)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(20, 14%, 7%)",
            border: "1px solid hsl(20, 14%, 14%)",
            borderRadius: "8px",
          }}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            name={line.name || line.dataKey}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
