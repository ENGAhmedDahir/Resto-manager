import { getAllOrders } from "@/services/apiOrders";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
  const {
    data: orders,
    err,
    isPending: isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  return { orders, err, isLoading };
}
