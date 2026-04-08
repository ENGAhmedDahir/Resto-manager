import { motion } from "framer-motion";
import { Minus, Plus, Trash2, FileText } from "lucide-react";
import { usePOS } from "@/context/POSContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui_components/Modal";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTables } from "@/features/tables/useTables";

const MotionDiv = motion.div;

export function POSCart({ className }) {
  const {
    state,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    dispatch,
    tax,
    taxRate,
    total,
  } = usePOS();

  const { tables, isLoading: isLoadingTables } = useTables();
  const {
    cart,
    orderType,
    tableNumber,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    notes,
  } = state;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="border-b border-border p-4 pt-16 lg:pt-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Current Order</h2>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>

        <Separator className="  mb-2" />

        {/* Order type */}
        <div className="flex gap-2 flex-wrap    sm:flex-nowrap">
          {["dine-in", "takeaway", "delivery"].map((type) => (
            <Button
              key={type}
              variant={orderType === type ? "default" : "outline"}
              size="sm"
              onClick={() =>
                dispatch({ type: "SET_ORDER_TYPE", payload: type })
              }
              className="flex-1 capitalize text-xs sm:text-sm min-w-[80px]"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Conditional fields */}
        {orderType === "dine-in" && (
          <div className="mt-3">
            <Select
              value={tableNumber}
              onValueChange={(value) =>
                dispatch({ type: "SET_TABLE_NUMBER", payload: value })
              }
              disabled={isLoadingTables}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue
                  placeholder={
                    isLoadingTables ? "Loading tables..." : "Select Table"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tables?.map((table) => (
                  <SelectItem
                    key={table._id}
                    value={String(table.tableNumber)}
                    disabled={table.status === "occupied"}
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>Table {table.tableNumber}</span>
                      <span
                        className={cn(
                          "text-[10px] uppercase px-1.5 py-0.5 rounded-full ml-auto",
                          table.status === "available"
                            ? "bg-green-100 text-green-700"
                            : table.status === "occupied"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {table.status}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(orderType === "takeaway" || orderType === "delivery") && (
          <Input
            placeholder="Customer name"
            value={customerName}
            onChange={(e) =>
              dispatch({ type: "SET_CUSTOMER_NAME", payload: e.target.value })
            }
            className="mt-3"
          />
        )}

        {orderType === "takeaway" && (
          <Input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) =>
              dispatch({ type: "SET_CUSTOMER_PHONE", payload: e.target.value })
            }
            className="mt-3"
          />
        )}

        {orderType === "delivery" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <Input
                placeholder="Email"
                value={customerEmail}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CUSTOMER_EMAIL",
                    payload: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CUSTOMER_PHONE",
                    payload: e.target.value,
                  })
                }
              />
            </div>
            <Input
              placeholder="Full address"
              value={deliveryAddress.fullAddress || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_DELIVERY_ADDRESS",
                  payload: { fullAddress: e.target.value },
                })
              }
              className="mt-2"
            />
          </>
        )}

        {/* Payment + Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <select
            className="border rounded px-3 py-2 bg-background"
            value={paymentMethod}
            onChange={(e) =>
              dispatch({ type: "SET_PAYMENT_METHOD", payload: e.target.value })
            }
          >
            {["Cash", "Card", "Mobile Money", "Online"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <Input
            placeholder="Order notes (optional)"
            value={notes}
            onChange={(e) =>
              dispatch({ type: "SET_NOTES", payload: e.target.value })
            }
          />
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-secondary/10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm sm:text-base">No items in cart</p>
            <p className="text-xs sm:text-sm">Add items to start an order</p>
          </div>
        ) : (
          cart.map((item) => (
            <MotionDiv
              key={item.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm sm:text-base">
                  {item.name}
                </p>
                <p className="text-xs sm:text-sm text-primary">
                  ${item.price.toFixed(2)}
                </p>
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="font-semibold text-sm sm:text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>
            </MotionDiv>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-3 bg-card">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-semibold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <Modal.Open opens="confirm-order">
          <Button className="w-full" size="lg" disabled={cart.length === 0}>
            <span>Checkout • ${total.toFixed(2)}</span>
          </Button>
        </Modal.Open>
      </div>
    </div>
  );
}
