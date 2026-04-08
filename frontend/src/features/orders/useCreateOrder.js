// src/features/orders/useCreateOrder.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder as createOrderApi } from "@/services/apiOrders";
import toast from "react-hot-toast";

export function useCreateOrder({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  const { mutate: createOrder, isPending: isCreating } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to place order");
    },
  });

  return { createOrder, isCreating };
}
