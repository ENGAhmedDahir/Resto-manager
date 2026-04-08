import { getTables } from "@/services/apiTables";
import { useQuery } from "@tanstack/react-query";

export function useTables() {
  const { isPending: isLoading, data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });
  return { tables, isLoading };
}
