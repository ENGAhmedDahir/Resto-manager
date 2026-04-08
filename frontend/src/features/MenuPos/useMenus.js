import { getMenus } from "@/services/apiMenu";
import { useQuery } from "@tanstack/react-query";

export function useMenus() {
  const {
    isPending: isLoading,
    error,
    data: menus,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  return { isLoading, menus, error };
}
