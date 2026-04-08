import { useState } from "react";
import ReportsFilter from "./ReportsFilter";
import RevenueAndOrdersChart from "./RevenueAndOrdersChart";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import Stats from "./Stats";
import TopSellingItems from "./TopSellingItems";
import { useReports } from "./useReports";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";

export default function Reports() {
  const [period, setPeriod] = useState("today");
  const { reports, isLoading } = useReports(period);
  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <ReportsFilter
          reports={reports}
          period={period}
          setPeriod={setPeriod}
        />
        {/* Stats */}
        <Stats reports={reports} />
        {/* Charts Row 1 */}
        <RevenueAndOrdersChart reports={reports} period={period} />

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category Distribution */}
          <RevenueByCategoryChart reports={reports} />

          {/* Top Selling Items */}
          <TopSellingItems reports={reports} />
        </div>
      </div>
    </>
  );
}
