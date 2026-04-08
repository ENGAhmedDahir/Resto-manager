import OrderTable from "./OrderTable";

import OrderStats from "./OrderStats";

export default function Orders() {
  return (
    <>
      {/* Status Stats */}
      <OrderStats />
      {/* Orders Table */}
      <OrderTable />

      {/* Order Drawer */}
    </>
  );
}
