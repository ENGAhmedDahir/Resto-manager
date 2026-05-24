import { DataTable } from "@/components/pos/DataTable";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../../services/apiInventory";
import {
  HiPencil,
  HiTrash,
  HiArrowDownTray,
  HiArrowUpTray,
} from "react-icons/hi2";
import Menus from "@/components/ui_components/Menus";
import Modal from "@/components/ui_components/Modal";
import DeleteInventory from "./DeleteInventory";
import AddInventoryForm from "./AddInventoryForm";
import AdjustStockForm from "./AdjustStockForm";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
// import Empty from "@/components/ui_components/Empty";

function InventoryTable() {
  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);
  const isAdminOrManagerOrChef =
    user && ["admin", "manager", "chef"].includes(user.role);

  const {
    isLoading,
    data: inventory = [],
    error,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  });
  // console.log(inventory);
  const columns = [
    {
      key: "itemName",
      header: "Item Name",
      sortable: true,
      className: "font-medium",
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (value, row) => <span>{row.category?.name || "N/A"}</span>,
    },
    { key: "supplier", header: "Supplier", sortable: true },
    { key: "unit", header: "Unit", sortable: true },
    { key: "quantity", header: "Quantity", sortable: true },
    {
      key: "lowStockLevel",
      header: "Low Stock",
      sortable: true,
      render: (value, row) => (
        <span className={row.quantity < value ? "text-red-500 font-bold" : ""}>
          {value}
        </span>
      ),
    },
    {
      key: "costPrice",
      header: "Cost Price",
      sortable: true,
      render: (value) => <span>${Number(value || 0).toFixed(2)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_, row) => {
        const quantity = row.quantity ?? 0;
        const lowStockLevel = row.lowStockLevel ?? 5;

        let status = "In Stock";
        if (quantity === 0) status = "Out of Stock";
        else if (quantity <= lowStockLevel) status = "Low Stock";

        let color = "";
        if (status === "In Stock") color = "bg-green-100 text-green-800";
        if (status === "Low Stock") color = "bg-yellow-100 text-yellow-800";
        if (status === "Out of Stock") color = "bg-red-100 text-red-800";

        return (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${color}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (_, row) => (
        <Menus.Menu>
          <Menus.Toggle id={row._id} />
          <Menus.List id={row._id}>
            {isAdminOrManagerOrChef && (
              <>
                <Modal.Open opens={`add-stock-${row._id}`}>
                  <Menus.Button icon={<HiArrowDownTray />}>
                    Add Stock
                  </Menus.Button>
                </Modal.Open>

                <Modal.Open opens={`remove-stock-${row._id}`}>
                  <Menus.Button icon={<HiArrowUpTray />}>
                    Remove Stock
                  </Menus.Button>
                </Modal.Open>
              </>
            )}

            {isAdminOrManager && (
              <>
                <Modal.Open opens={`edit-inventory-${row._id}`}>
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens={`delete-inventory-${row._id}`}>
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </>
            )}
          </Menus.List>

          <Modal.Window name={`add-stock-${row._id}`}>
            <AdjustStockForm
              id={row._id}
              itemName={row.itemName}
              action="add"
            />
          </Modal.Window>

          <Modal.Window name={`remove-stock-${row._id}`}>
            <AdjustStockForm
              id={row._id}
              itemName={row.itemName}
              action="remove"
            />
          </Modal.Window>

          <Modal.Window
            name={`edit-inventory-${row._id}`}
            title="Update inventory"
            description="Update  inventory   details"
            size="full"
          >
            <AddInventoryForm inventoryToEdit={row} />
          </Modal.Window>

          <Modal.Window name={`delete-inventory-${row._id}`}>
            <DeleteInventory id={row._id} />
          </Modal.Window>
        </Menus.Menu>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner message="Loading inventory..." />;
  // if (error) return <Empty resourceName="inventory" />;

  return (
    <Menus>
      <Modal>
        <DataTable
          data={inventory}
          columns={columns}
          searchKeys={["itemName", "category", "supplier"]}
          searchPlaceholder="Search items..."
        />
      </Modal>
    </Menus>
  );
}

export default InventoryTable;
