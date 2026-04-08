import { PieChartComponent } from "@/components/pos/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Optional: predefined palette for known categories
const CATEGORY_COLORS = {
  Sandwiches: "hsl(32, 95%, 55%)",
  Pasta: "hsl(142, 76%, 36%)",
  "Coffee & Tea": "hsl(199, 89%, 48%)",
  Pizzas: "hsl(280, 87%, 65%)",
  Vegan: "hsl(20, 90%, 50%)",
  Desserts: "hsl(340, 82%, 52%)",
  Breakfast: "hsl(45, 100%, 50%)",
};

// Generate a stable color from category name if not in predefined palette
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

function RevenueByCategoryChart({ reports }) {
  // Real backend data
  const rawData = reports?.revenueByCategory || [];

  // Map backend data and inject colors
  const categoryData = rawData.map((cat) => ({
    name: cat.categoryName,
    value: cat.revenue,
    percentage: cat.percentage,
    color: CATEGORY_COLORS[cat.categoryName] || stringToColor(cat.categoryName),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Revenue by Category
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[200px]">
          <PieChartComponent data={categoryData} />
        </div>

        <div className="mt-4 space-y-2">
          {categoryData.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-muted-foreground">{cat.name}</span>
              </div>

              <div className="text-right">
                <span className="font-medium">
                  ${cat.value.toLocaleString()}
                </span>
                <span className="ml-2 text-muted-foreground">
                  ({cat.percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueByCategoryChart;
