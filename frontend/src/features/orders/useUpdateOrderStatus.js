import { updateOrderStatus as updateOrderStatusApi } from "@/services/apiOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateOrderStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      updateOrderStatusApi({ orderId, newStatus }),

    onSuccess: () => {
      toast.success("Order status successfully updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },

    onError: (err) => {
      toast.error(err.message || "Failed to update order status");
    },
  });

  return { updateOrderStatus, isUpdating };
}
