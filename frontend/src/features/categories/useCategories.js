import { getCategories } from "@/services/apiCategries";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const {
    isPending: isLoading,
    error,
    data: categories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { isLoading, categories, error };
}
