import React, { useEffect } from "react";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  CreditCard,
  Receipt,
  ChefHat,
  Truck,
  UtensilsCrossed,
  MapPinCheckInside,
  Mail,
  DollarSign,
  AlertCircle,
  User,
  MapPin,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useOrder } from "./useOrder";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import CancelOrder from "./CancelOrder";
import { CheckboxField } from "@/components/form/CheckboxField";
import { useForm } from "react-hook-form";
import { useUpdateOrderStatus } from "./useUpdateOrderStatus";
import { useUpdatePaymentStatus } from "./useUpdatePayment";
import PrintReceiptButton from "@/components/ui_components/PrintReceiptButton";
import { useMoveBack } from "@/hooks/useMoveBack";

/* ================= CONFIGS ================= */

const statusConfig = {
  pending: { variant: "warning", icon: Clock },
  preparing: { variant: "info", icon: AlertCircle },
  ready: { variant: "success", icon: CheckCircle },
  completed: { variant: "secondary", icon: CheckCircle },
};

const orderTypeConfig = {
  "dine-in": { label: "Dine-in", icon: UtensilsCrossed },
  takeaway: { label: "Takeaway", icon: Receipt },
  delivery: { label: "Delivery", icon: Truck },
};

/* ================= COMPONENT ================= */

export default function OrderDetailsPage() {
  // 🔥 ALL HOOKS MUST BE AT TOP (NO CONDITIONS ABOVE)

  const navigate = useNavigate();
  const { order, isLoading, error } = useOrder();
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const { updatePaymentStatus, isUpdating: isUpdatingPayment } =
    useUpdatePaymentStatus();
  const moveBack = useMoveBack();
  const { user } = useCurrentUser();

  const { control, watch, setValue } = useForm({
    defaultValues: { isPaid: false }, // ✅ static default
  });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (order) setValue("isPaid", Boolean(order.isPaid));
  }, [order, setValue]);

  /* ================= EARLY RETURNS ================= */

  if (isLoading) return <LoadingSpinner message="Loading Order..." />;
  if (error || !order)
    return <p className="p-6 text-destructive">Failed to load order</p>;

  /* ================= DERIVED VALUES ================= */

  const status = order.orderStatus?.toLowerCase();
  const orderType = order.orderType?.toLowerCase();
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const OrderTypeIcon = orderTypeConfig[orderType]?.icon || Receipt;

  const canCancel = ["pending", "preparing"].includes(status);

  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);
  const isAdminOrManagerOrChef =
    user && ["admin", "manager", "chef"].includes(user.role);
  const isAdminOrManagerOrCashier =
    user && ["admin", "manager", "cashier"].includes(user.role);

  /* ================= ACTIONS ================= */

  const handleStatusUpdate = (newStatus) =>
    updateOrderStatus({ orderId: order._id, newStatus });

  const handlePayment = () => {
    if (!order.isPaid)
      updatePaymentStatus({ orderId: order._id, isPaid: true });
  };

  const getStatusButton = () => {
    if (status === "pending" && isAdminOrManagerOrChef)
      return (
        <Button
          onClick={() => handleStatusUpdate("Preparing")}
          disabled={isUpdating}
          variant="secondary"
        >
          <ChefHat className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Preparing"}
        </Button>
      );

    if (status === "preparing" && isAdminOrManagerOrChef)
      return (
        <Button
          onClick={() => handleStatusUpdate("Ready")}
          disabled={isUpdating}
          variant="success"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Ready"}
        </Button>
      );

    if (status === "ready" && isAdminOrManagerOrCashier)
      return (
        <Button
          onClick={() => handleStatusUpdate("Completed")}
          disabled={isUpdating}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isUpdating ? "Updating..." : "Mark as Completed"}
        </Button>
      );

    return null;
  };

  /* ================= UI ================= */

  return (
    <div className="container space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <Button variant="outline" onClick={moveBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <PrintReceiptButton />
      </div>

      <div className="rounded-2xl shadow-md overflow-hidden">
        <div className="gradient-primary text-primary-foreground px-6 py-4 flex justify-between">
          <div className="flex items-center gap-3">
            <OrderTypeIcon className="w-5 h-5" />
            <span className="font-semibold">
              {orderTypeConfig[orderType]?.label}
            </span>
            <span>{order.items.length} items</span>
          </div>

          <Badge variant={config.variant} className="capitalize gap-1">
            <StatusIcon className="h-3 w-3" />
            {order.orderStatus}
          </Badge>
        </div>

        <div className="p-6 space-y-6 bg-card">
          {/* Customer Info */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{order.customerName}</span>
            </div>
            {order.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {order.customerEmail}
              </div>
            )}
            {order.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {order.customerPhone}
              </div>
            )}
          </div>

          {order.deliveryAddress?.fullAddress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinCheckInside className="w-4 h-4" />
              {order.deliveryAddress.fullAddress}
            </div>
          )}

          {order.tableNumber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Table #{order.tableNumber?.tableNumber || order.tableNumber}
            </div>
          )}

          <Separator />

          {/* Items */}
          {order.items.map((item) => (
            <Card key={item._id} className="p-4">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">
                    {item.quantity}× {item.menuItem.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${item.price} each
                  </p>
                </div>
                <span className="font-semibold">
                  ${item.itemTotal.toFixed(2)}
                </span>
              </div>
            </Card>
          ))}

          {/* Total */}
          <div className="gradient-primary p-4 rounded-lg flex justify-between">
            <div className="flex items-center gap-2 font-semibold text-white">
              <DollarSign className="w-5 h-5" />${order.totalAmount.toFixed(2)}
            </div>
            <Badge variant="success">{order.isPaid ? "PAID" : "UNPAID"}</Badge>
          </div>

          <div className="flex justify-between">
            {getStatusButton()}
            {canCancel && isAdminOrManagerOrCashier && (
              <CancelOrder orderId={order._id} />
            )}
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment: {order.paymentMethod}
          </p>
        </div>
      </div>

      {/* Payment Checkbox */}
      {isAdminOrManagerOrCashier && (
        <Card>
          <CardContent>
            <CheckboxField
              control={control}
              name="isPaid"
              label={`Confirm payment of $${order.totalAmount.toFixed(2)}`}
              disabled={status === "cancelled" || order.isPaid}
              className="scale-200"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        {isAdminOrManagerOrCashier && (
          <Button
            variant="success"
            onClick={handlePayment}
            disabled={
              order.isPaid || status === "cancelled" || isUpdatingPayment
            }
          >
            {isUpdatingPayment ? "Updating..." : "Complete the payment"}
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </div>
    </div>
  );
}
