import { DataTable } from "@/components/pos/DataTable";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useOrders } from "./useOrders";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Trash,
} from "lucide-react";
import Menus from "@/components/ui_components/Menus";
import { useNavigate } from "react-router-dom";
import DeleteOrder from "./DeleteOrder";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import Modal from "@/components/ui_components/Modal";

const statusConfig = {
  Pending: { variant: "warning", icon: Clock, label: "Pending" },
  Preparing: { variant: "info", icon: AlertCircle, label: "Preparing" },
  Ready: { variant: "success", icon: CheckCircle, label: "Ready" },
  Completed: { variant: "secondary", icon: CheckCircle, label: "Completed" },
  Cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
};

function OrderTable() {
  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);
  const { orders = [], isLoading } = useOrders();
  const navigate = useNavigate();

  const filters = [
    {
      key: "orderStatus",
      label: "Status",
      options: Object.keys(statusConfig).map((s) => ({
        value: s,
        label: s,
      })),
    },
    {
      key: "orderType",
      label: "Order Type",
      options: [
        { value: "dine-in", label: "Dine-in" },
        { value: "takeaway", label: "Takeaway" },
        { value: "delivery", label: "Delivery" },
      ],
    },
  ];

  const columns = [
    { key: "customerName", header: "Customer", sortable: true },

    {
      key: "orderType",
      header: "Type",
      sortable: true,
      render: (value) => <span className="capitalize">{value}</span>,
    },

    {
      key: "items",
      header: "Items",
      sortable: true,
      render: (items) => <span>{items.length} items</span>,
    },

    {
      key: "totalAmount",
      header: "Total",
      sortable: true,
      render: (value) => <span>${value.toFixed(2)}</span>,
    },

    {
      key: "orderStatus",
      header: "Status",
      render: (value) => {
        const config = statusConfig[value];
        const Icon = config.icon;

        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },

    {
      key: "_id",
      header: "",
      render: (_, row) => {
        const menuId = `order-${row._id}`;

        return (
          <>
            {isAdminOrManager && <DeleteOrder orderId={row._id} />}
            <Menus.Menu>
              <Menus.Toggle id={menuId} />

              <Menus.List id={menuId}>
                <Menus.Button
                  icon={<Eye className="h-4 w-4 text-accent" />}
                  onClick={() => navigate(`/order/${row._id}`)}
                >
                  See more details
                </Menus.Button>

                {isAdminOrManager && (
                  <Modal.Open opens={`delete-order-${row._id}`}>
                    <Menus.Button
                      icon={<Trash className="h-4 w-4 text-destructive" />}
                    >
                      Delete Order
                    </Menus.Button>
                  </Modal.Open>
                )}
              </Menus.List>
            </Menus.Menu>
          </>
        );
      },
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading order data..." />;

  return (
    <Menus>
      <Modal>
        <DataTable
          data={orders}
          columns={columns}
          searchKeys={["customerName"]}
          searchPlaceholder="Search orders..."
          filters={filters}
        />
      </Modal>
    </Menus>
  );
}

export default OrderTable;
