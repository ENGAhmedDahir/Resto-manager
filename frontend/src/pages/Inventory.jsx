import InventoryTable from "../features/inventory/InventoryTable";
import AddInventory from "../features/inventory/InventoryOperations";
import Row from "../components/ui_components/Row";
import Heading from "../components/ui_components/Heading";

function Inventory() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Heading title="Inventory" subtitle="Manage stock and inventory items" />
        <AddInventory />
      </div>

      <Row>
        <InventoryTable />
      </Row>
    </>
  );
}

export default Inventory;
