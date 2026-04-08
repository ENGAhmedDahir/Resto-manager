import { HiPencil, HiTrash, HiUserGroup } from "react-icons/hi2";
import { useCurrentUser } from "../authentication/useCurrentUser";
import Menus from "@/components/ui_components/Menus";
import Modal from "@/components/ui_components/Modal";
import DeleteTable from "./DeleteTable";
import AddTableForm from "./AddTableForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TableCard({ table }) {
  const { _id: tableId, tableNumber, capacity, status } = table;

  const statusVariant =
    status === "available"
      ? "success"
      : status === "occupied"
        ? "destructive"
        : "secondary";

  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <div className="absolute top-3 right-3 z-10">
        {isAdminOrManager && (
          <Menus.Menu>
            <Menus.Toggle id={tableId} />
            <Menus.List id={tableId}>
              <Modal.Open opens={`edit-table-${tableId}`}>
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens={`delete-table-${tableId}`}>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-mono text-foreground">
          Table {tableNumber}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Badge variant={statusVariant} className="capitalize">
          {status}
        </Badge>

        <div className="flex items-center gap-2 text-muted-foreground">
          <HiUserGroup className="h-6 w-6 text-primary" />
          <span className="text-lg font-medium">Capacity: {capacity}</span>
        </div>
      </CardContent>

      <Modal.Window
        name={`edit-table-${tableId}`}
        title=" Edit Table"
        description="Edit your table"
        size="full"
      >
        <AddTableForm tableToEdit={table} />
      </Modal.Window>
      <Modal.Window
        name={`delete-table-${tableId}`}
        title=" Delete Table"
        description="Are you sure you want to delete this Table?"
      >
        <DeleteTable id={tableId} tableNumber={tableNumber} />
      </Modal.Window>
    </Card>
  );
}

export default TableCard;
