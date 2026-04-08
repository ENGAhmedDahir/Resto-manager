import { StatCard } from "@/components/pos/StatCard";
import {
  CircleCheckBig,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

function Stats({ reports }) {
  const {
    totalRevenue = 0,
    totalOrders = 0,
    averageOrderValue = 0,
    totalCompletedOrders = 0,
  } = reports?.stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        icon={DollarSign}
      />

      <StatCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={ShoppingBag}
      />

      <StatCard
        title="Avg. Order Value"
        value={`$${(averageOrderValue ?? 0).toFixed(2)}`}
        icon={TrendingUp}
      />

      <StatCard
        title="Completed Order"
        value={totalCompletedOrders}
        icon={CircleCheckBig}
      />
    </div>
  );
}

export default Stats;
