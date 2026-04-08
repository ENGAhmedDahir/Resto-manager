import { HiMiniPlus } from "react-icons/hi2";
import Modal from "../../components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import AddTableForm from "./AddTableForm";

import { useCurrentUser } from "../authentication/useCurrentUser";

function TableOperations() {
  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  if (!isAdminOrManager) return null;

  return (
    <Modal>
      <Modal.Open opens="table-form">
        <Button size="sm" className="h-9">
          <HiMiniPlus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </Modal.Open>
      <Modal.Window
        name="table-form"
        title="Add Table"
        description="Create a new table for your restaurant"
        size="full"
      >
        <AddTableForm />
      </Modal.Window>
    </Modal>
  );
}

export default TableOperations;
