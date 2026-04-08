import { getOrder } from "@/services/apiOrders";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
export function useOrder() {
  const { orderId } = useParams();
  const {
    isPending: isLoading,
    error,
    data: order,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    retry: false,
  });

  return { order, error, isLoading };
}
