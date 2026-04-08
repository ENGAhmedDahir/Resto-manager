import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui_components/Modal";
import { useCancelOrder } from "./useCancelOrder";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function CancelOrder({ orderId }) {
  const { cancelOrder, isCancelling } = useCancelOrder();

  return (
    <Modal>
      <Modal.Open opens="cancel-order">
        <Button variant="destructive">Cancel Order</Button>
      </Modal.Open>

      <Modal.Window
        name="cancel-order"
        title="Cancel Order"
        description="This will stop the order and mark it as cancelled."
      >
        {({ onCloseModal }) => (
          <div className="space-y-4">
            <p className="text-sm">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCloseModal}>
                No
              </Button>
              <Button
                variant="destructive"
                disabled={isCancelling}
                onClick={() =>
                  cancelOrder(orderId, {
                    onSuccess: onCloseModal,
                  })
                }
              >
                {isCancelling && <SpinnerMini />}
                {isCancelling ? "canceling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        )}
      </Modal.Window>
    </Modal>
  );
}
export default CancelOrder;
