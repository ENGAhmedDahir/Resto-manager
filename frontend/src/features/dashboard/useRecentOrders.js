import { getRecentOrders } from "@/services/apiOrders";
import { useQuery } from "@tanstack/react-query";

export function useRecentOrders() {
  const {
    isPending: isLoading,
    error,
    data: recentOrders,
  } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: getRecentOrders,
  });

  return { isLoading, recentOrders, error };
}
