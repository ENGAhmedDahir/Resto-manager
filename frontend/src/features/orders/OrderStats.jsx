import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useOrderStats } from "./useOrderStats";

const statusConfig = {
  pending: { icon: Clock, label: "Pending", key: "totalPending" },
  preparing: { icon: AlertCircle, label: "Preparing", key: "totalPreparing" },
  ready: { icon: CheckCircle, label: "Ready", key: "totalReady" },
  completed: { icon: CheckCircle, label: "Completed", key: "totalCompleted" },
  cancelled: { icon: XCircle, label: "Cancelled", key: "totalCancelled" },
};

const statusStyles = {
  pending: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",
  },
  preparing: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  },
  ready: {
    bg: "bg-green-500/10",
    text: "text-green-600",
  },
  completed: {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
  },
  cancelled: {
    bg: "bg-red-500/10",
    text: "text-red-600",
  },
};

function OrderStats() {
  const { orderStat = {}, isLoading } = useOrderStats();

  if (isLoading) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {Object.entries(statusConfig).map(([status, config]) => {
        const Icon = config.icon;
        const styles = statusStyles[status];

        // ✅ Read correct value from backend stats
        const count = orderStat[config.key] ?? 0;

        return (
          <Card key={status}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg p-2 ${styles.bg}`}>
                <Icon className={`h-5 w-5 ${styles.text}`} />
              </div>

              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default OrderStats;
