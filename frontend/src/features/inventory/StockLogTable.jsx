import { DataTable } from "@/components/pos/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getStockLogs } from "../../services/apiInventory";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

function StockLogTable() {
  const {
    isLoading,
    data: logs = [],
    error,
  } = useQuery({
    queryKey: ["stockLogs"],
    queryFn: getStockLogs,
  });

  const columns = [
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (value) => format(new Date(value), "MMM dd, yyyy HH:mm"),
    },
    {
      key: "item",
      header: "Item Name",
      sortable: true,
      render: (item) => item?.itemName || "Deleted Item",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "IN" ? "success" : "destructive"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      render: (value, row) => (
        <span className={row.type === "IN" ? "text-green-600" : "text-red-600"}>
          {row.type === "IN" ? "+" : "-"}
          {value} {row.item?.unit}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
    },
    {
      key: "doneBy",
      header: "Done By",
      render: (user) =>
        user
          ? `${user.username} (${user.role})` // muujin username iyo role
          : "System", // haddii user ma jiro
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading stock logs..." />;

  return (
    <div className="space-y-4">
      <DataTable
        data={logs}
        columns={columns}
        searchKeys={["reason"]}
        searchPlaceholder="Search logs by reason..."
      />
    </div>
  );
}

export default StockLogTable;
