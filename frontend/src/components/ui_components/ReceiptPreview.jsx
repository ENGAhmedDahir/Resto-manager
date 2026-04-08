import { usePOS } from "@/context/POSContext";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const ReceiptPreview = forwardRef(function ReceiptPreview(
  { className },
  ref
) {
  const { state, cartTotal, tax, taxRate, total } = usePOS();
  const { cart, orderType, tableNumber, customerName } = state;

  const now = new Date();

  return (
    <div ref={ref} className={cn("receipt-paper", className)}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">RESTAURANT MANGER</h3>
        <p className="text-xs">123 Main Street, City</p>
        <p className="text-xs">Tel: (555) 123-4567</p>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2" />

      <div className="text-xs space-y-1 mb-3">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{now.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{now.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Order Type:</span>
          <span className="capitalize">{orderType}</span>
        </div>

        {tableNumber && (
          <div className="flex justify-between">
            <span>Table:</span>
            <span>{tableNumber}</span>
          </div>
        )}

        {customerName && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{customerName}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-2" />

      <div className="space-y-2 mb-3">
        {cart.length === 0 ? (
          <p className="text-center text-xs text-gray-500">No items</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="text-xs">
              <div className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>

              {item.notes && (
                <p className="text-gray-500 pl-4">- {item.notes}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-2" />

      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({taxRate}%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm pt-1">
          <span>TOTAL:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-3" />

      <div className="text-center text-xs">
        <p>Thank you for dining with us!</p>
        <p className="text-gray-500 mt-1">*** RECEIPT ***</p>
      </div>
    </div>
  );
});
