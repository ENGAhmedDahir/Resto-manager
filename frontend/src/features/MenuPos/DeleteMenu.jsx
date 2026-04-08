import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteMenu } from "./useDeleteMenu";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function DeleteMenu({ menuItemId, menuItemName }) {
  const { deleteMenu, isDeleting } = useDeleteMenu();

  const handleDelete = (onCloseModal) => {
    deleteMenu(menuItemId, {
      onSuccess: () => {
        onCloseModal();
      },
    });
  };

  return (
    <Modal>
      <Modal.Open opens={`delete-Menu-${menuItemId}`}>
        <Button variant="ghost" size="icon-sm" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </Modal.Open>

      <Modal.Window
        name={`delete-Menu-${menuItemId}`}
        title="Delete Menu"
        description="Are you sure you want to delete this menu?"
      >
        {({ onCloseModal }) => (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You are about to delete the menu{" "}
              <span className="font-semibold">{menuItemName}</span>. This action
              cannot be undone.
            </p>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={onCloseModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleDelete(onCloseModal)}
                disabled={isDeleting}
              >
                {isDeleting && <SpinnerMini />}
                {isDeleting ? "Deleting..." : "Delete Menu"}
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal.Window>
    </Modal>
  );
}

export default DeleteMenu;
