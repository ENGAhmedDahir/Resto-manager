import { Button } from "@/components/ui/button";
import SpinnerMini from "@/components/ui_components/SpinnerMini";
import { useDeleteTable } from "./useDeleteTable";

function DeleteTable({ id, tableNumber, onCloseModal }) {
  const { deleteTable, isDeleting } = useDeleteTable();

  const handleDelete = () => {
    deleteTable(id);
    onCloseModal?.();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You are about to delete the Table{" "}
        <span className="text-red-600 font-bold "> {tableNumber}</span> This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCloseModal} disabled={isDeleting}>
          Cancel
        </Button>

        <Button
          variant="destructive"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting && <SpinnerMini />}
          {isDeleting ? "Deleting..." : "Delete Table"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteTable;
