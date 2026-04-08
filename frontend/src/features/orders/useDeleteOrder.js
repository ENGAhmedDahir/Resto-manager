import { deleteOrder as deleteOrderApi } from "@/services/apiOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
    mutationFn: (orderId) => deleteOrderApi(orderId),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteOrder, isDeleting };
}
