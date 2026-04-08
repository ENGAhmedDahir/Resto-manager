import { updatePaymentStatus as updatePaymentStatusApi } from "@/services/apiOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  const { mutate: updatePaymentStatus, isPending } = useMutation({
    mutationFn: ({ orderId, isPaid }) =>
      updatePaymentStatusApi({ orderId, isPaid }),

    onSuccess: () => {
      toast.success("Payment completed successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },

    onError: (err) => {
      toast.error(err.message || "Failed to complete payment");
    },
  });

  return { updatePaymentStatus, isUpdating: isPending };
}
