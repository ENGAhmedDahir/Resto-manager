import Modal from "../../components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import AddInventoryForm from "./AddInventoryForm";
import { HiMiniPlus } from "react-icons/hi2";

import { useCurrentUser } from "../authentication/useCurrentUser";

function AddInventory() {
  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  if (!isAdminOrManager) return null;

  return (
    <div>
      <Modal>
        <Modal.Open opens="inventory-form">
          <Button>
            <HiMiniPlus className="mr-2 h-4 w-4" />
            Add new item
          </Button>
        </Modal.Open>
        <Modal.Window
          name="inventory-form"
          title="Add inventory"
          description="Create a new inventory for your restaurant"
          size="full"
        >
          <AddInventoryForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddInventory;
