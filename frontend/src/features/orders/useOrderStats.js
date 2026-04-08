import { getOrderStats } from "@/services/apiOrders";
import { useQuery } from "@tanstack/react-query";

export function useOrderStats() {
  const {
    isPending: isLoading,
    error,
    data: orderStat,
  } = useQuery({
    queryKey: ["orderStats"],
    queryFn: getOrderStats,
  });

  return { orderStat, error, isLoading };
}
