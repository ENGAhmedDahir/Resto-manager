import Modal from "@/components/ui_components/Modal";
import { useDeleteUser } from "./useDeleteUser";
import { Button } from "@/components/ui/button";

function DeleteUserModal({ userId, username }) {
  const { deleteUser, isDeleting } = useDeleteUser();

  const handleDelete = (onCloseModal) => {
    deleteUser(userId, {
      onSuccess: () => {
        onCloseModal();
      },
    });
  };

  return (
    <Modal.Window
      name={`delete-user-${userId}`}
      title="Delete user"
      description="Are you sure you want to delete this user?"
    >
      {({ onCloseModal }) => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are about to delete the user{" "}
            <span className="font-semibold">{username}</span>. This action
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
              {isDeleting ? "Deleting..." : "Delete user"}
            </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal.Window>
  );
}

export default DeleteUserModal;
