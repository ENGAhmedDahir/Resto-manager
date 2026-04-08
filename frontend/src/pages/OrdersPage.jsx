import Heading from "@/components/ui_components/Heading";
import Orders from "@/features/orders/Orders";

function OrdersPage() {
  return (
    <>
      <Heading title="Orders" subtitle="Manage and track all orders" />
      <Orders />
    </>
  );
}

export default OrdersPage;
