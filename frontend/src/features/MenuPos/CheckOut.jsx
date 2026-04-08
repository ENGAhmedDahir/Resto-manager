// src/components/pos/CheckOut.jsx
import { Modal } from "@/components/ui_components/Modal";
import { ReceiptPreview } from "@/components/ui_components/ReceiptPreview";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/context/POSContext";
import toast from "react-hot-toast";
import { useCreateOrder } from "@/features/orders/useCreateOrder";

function CheckOut() {
  const { state, cartTotal, tax, taxRate, total, dispatch } = usePOS();

  const { createOrder, isCreating } = useCreateOrder({
    onSuccess: (data) => {
      dispatch({
        type: "SET_CURRENT_ORDER",
        payload: data?.data?.order || data?.order,
      });
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "RESET_ORDER_INFO" });
    },
  });

  return (
    <Modal.Window
      name="confirm-order"
      title="Confirm Order"
      description="Please review your order before confirming"
      size="xl"
    >
      {({ onCloseModal }) => {
        const handleConfirmOrder = () => {
          /* =====================
             VALIDATION (FIXED)
          ===================== */

          // DINE-IN → table number only
          if (state.orderType === "dine-in" && !state.tableNumber.trim()) {
            toast.error("Please enter a table number");
            return;
          }

          // DELIVERY
          if (state.orderType === "delivery") {
            if (!state.customerName.trim()) {
              toast.error("Please enter customer name");
              return;
            }
            if (!state.customerEmail.trim()) {
              toast.error("Email is required for delivery");
              return;
            }
            if (!state.customerPhone.trim()) {
              toast.error("Phone is required for delivery");
              return;
            }
            if (!state.deliveryAddress.fullAddress?.trim()) {
              toast.error("Full address is required for delivery");
              return;
            }
          }

          // TAKEAWAY
          if (state.orderType === "takeaway") {
            if (!state.customerName.trim()) {
              toast.error("Please enter customer name");
              return;
            }
            if (!state.customerPhone.trim()) {
              toast.error("Phone is required for takeaway");
              return;
            }
          }

          /* =====================
             PAYLOAD
          ===================== */

          const payload = {
            customerName:
              state.orderType === "dine-in" ? undefined : state.customerName,
            customerEmail:
              state.orderType === "delivery" ? state.customerEmail : undefined,
            customerPhone:
              state.orderType !== "dine-in" ? state.customerPhone : undefined,
            items: state.cart.map((item) => ({
              menuItem: item.id,
              quantity: item.quantity,
            })),
            orderType: state.orderType,
            tableNumber:
              state.orderType === "dine-in" ? state.tableNumber : undefined,
            deliveryAddress:
              state.orderType === "delivery"
                ? state.deliveryAddress
                : undefined,
            paymentMethod: state.paymentMethod || "Cash",
            notes: state.notes || undefined,
          };

          createOrder(payload);
          onCloseModal();
        };

        return (
          <>
            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {state.cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 space-y-1 text-sm border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt */}
              <div>
                <h3 className="font-medium mb-3">Receipt Preview</h3>
                <ReceiptPreview />
              </div>
            </div>

            {/* Footer */}
            <Modal.Footer>
              <Button variant="outline" onClick={onCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleConfirmOrder} disabled={isCreating}>
                {isCreating
                  ? "Processing..."
                  : `Confirm • $${total.toFixed(2)}`}
              </Button>
            </Modal.Footer>
          </>
        );
      }}
    </Modal.Window>
  );
}

export default CheckOut;
