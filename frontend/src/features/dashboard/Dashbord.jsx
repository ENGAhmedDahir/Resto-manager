import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import { useReports } from "../reports/useReports";
import RecentOrders from "./RecentOrders";
import RevenueThisWeekChart from "./RevenueThisWeekChart";
import Stats from "./Stats";
import { useState } from "react";
import OrdersThisWeekChart from "./OrdersThisWeekChart";

function Dashboard() {
  const [period, setPeriod] = useState("today");
  const { reports, isLoading } = useReports(period);
  // console.log(reports);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="space-y-6">
      <Stats reports={reports} />

      {/* Side by side – same size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentOrders />
        <div className="">
          <OrdersThisWeekChart />
        </div>
      </div>
      <RevenueThisWeekChart />
    </div>
  );
}

export default Dashboard;
