import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecentOrders } from "./useRecentOrders";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const MotionDiv = motion.div;

// Status config
const statusConfig = {
  Pending: { variant: "warning", icon: Clock },
  Preparing: { variant: "info", icon: AlertCircle },
  Ready: { variant: "success", icon: CheckCircle },
  Completed: { variant: "secondary", icon: CheckCircle },
};

function RecentOrders() {
  const { recentOrders = [], isLoading } = useRecentOrders();

  const navigate = useNavigate();

  if (isLoading) return <Spinner size="lg" center />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {recentOrders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm">
            No orders have been placed today 🍽️
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Orders container with fixed height */}
            <div className="flex-1 space-y-3 overflow-auto min-h-0">
              {recentOrders.map((order, index) => {
                const config =
                  statusConfig[order.orderStatus] || statusConfig.Pending;
                const StatusIcon = config.icon;

                return (
                  <MotionDiv
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-secondary/30 p-3"
                  >
                    {/* LEFT */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className="font-mono text-sm font-medium">
                        #{order._id.slice(-4)}
                      </span>

                      <span className="text-muted-foreground">
                        {order.orderType === "dine-in"
                          ? `Table ${order.tableNumber.tableNumber}`
                          : order.customerName || "Guest"}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {order.items.length} items
                      </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <span className="font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </span>

                      <Badge
                        variant={config.variant}
                        className="capitalize gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {order.orderStatus}
                      </Badge>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        See more
                      </Button>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>

            {/* View All Orders Button - Fixed at bottom */}
            <div className="pt-3 mt-auto">
              <Button onClick={() => navigate("/orders")} className="w-full">
                View All Orders
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default RecentOrders;
