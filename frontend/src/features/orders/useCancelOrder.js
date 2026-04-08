import { cancelOrder as cancelOrderApi } from "@/services/apiOrders";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: (orderId) => cancelOrderApi(orderId),
    onSuccess: () => {
      toast.success("order successfully canceled");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { cancelOrder, isCancelling };
}
