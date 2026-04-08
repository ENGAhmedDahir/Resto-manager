import { Modal } from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import { useDeleteOrder } from "./useDeleteOrder";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function DeleteOrder({ orderId }) {
  const { deleteOrder, isDeleting } = useDeleteOrder();

  return (
    <Modal.Window
      name={`delete-order-${orderId}`}
      title="Delete Order"
      description="Are you sure you want to delete this order?"
    >
      {({ onCloseModal }) => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are about to delete order{" "}
            <span className="font-semibold">{orderId}</span>. This action cannot
            be undone.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onCloseModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() =>
                deleteOrder(orderId, {
                  onSuccess: () => {
                    onCloseModal();
                  },
                })
              }
            >
              {isDeleting && <SpinnerMini />}
              {isDeleting ? "Deleting..." : "Delete Order"}
            </Button>
          </div>
        </div>
      )}
    </Modal.Window>
  );
}

export default DeleteOrder;
